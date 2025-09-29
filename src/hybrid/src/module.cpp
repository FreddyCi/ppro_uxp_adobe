/************************************************************************
 * Copyright 2022 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it.
 *************************************************************************
 */

#include <exception>
#include <stdexcept>
#include <string>

#include <cstdio>
#include <iostream>
#include <vector>
#include <filesystem>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <cctype>
#include <cstdlib>

#ifdef _WIN32
#include <windows.h>
#endif

#include "../src/utilities/UxpAddon.h"
#include "../src/utilities/UxpTask.h"
#include "../src/utilities/UxpValue.h"

namespace {

    std::string execWin(const char* cmd) {
        #ifdef _WIN32
            std::string result;
            HANDLE hPipeRead, hPipeWrite;

            SECURITY_ATTRIBUTES saAttr = { sizeof(SECURITY_ATTRIBUTES) };
            saAttr.bInheritHandle = TRUE;  // Ensure the read handle to the pipe for STDOUT is inherited.
            saAttr.lpSecurityDescriptor = NULL;

            // Create a pipe for the child process's STDOUT.
            if (!CreatePipe(&hPipeRead, &hPipeWrite, &saAttr, 0))
                throw std::runtime_error("Failed to create pipe");

            STARTUPINFOA si = { sizeof(STARTUPINFOA) };
            si.dwFlags = STARTF_USESHOWWINDOW | STARTF_USESTDHANDLES;
            si.hStdOutput = hPipeWrite;
            si.hStdError = hPipeWrite;
            si.wShowWindow = SW_HIDE;  // Prevents cmd window from flashing.
                                        // Requires STARTF_USESHOWWINDOW in dwFlags.

            PROCESS_INFORMATION pi = { 0 };

            std::string commandStr = cmd;
            if (commandStr.find(".exe") == std::string::npos) {
                // Prepend with cmd.exe path and /C switch
                commandStr = "C:\\Windows\\System32\\cmd.exe /C " + commandStr;
            }


            // Create a child process that uses the previously created pipes for STDOUT.
            if (!CreateProcessA(NULL, (LPSTR)commandStr.c_str(), NULL, NULL, TRUE, 0, NULL, NULL, &si, &pi)) {
                CloseHandle(hPipeWrite);
                CloseHandle(hPipeRead);
                throw std::runtime_error("Failed to create process");
            }

            CloseHandle(hPipeWrite);  // Close the write end of the pipe before reading from the read end of the pipe.

            // Read output from the child process's pipe for STDOUT and write to the parent process's pipe for STDOUT.
            DWORD dwRead;
            CHAR chBuf[4096];
            bool bSuccess = FALSE;
            for (;;) {
                bSuccess = ReadFile(hPipeRead, chBuf, 4096, &dwRead, NULL);
                if (!bSuccess || dwRead == 0) break;

                std::string part(chBuf, dwRead);
                result += part;
            }

            CloseHandle(hPipeRead);

            // Wait for the child process to exit.
            WaitForSingleObject(pi.hProcess, INFINITE);

            // Close process and thread handles.
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);

            return result;
        #else
        // For non-Windows systems, return an empty string or handle differently as needed
        return "";
        #endif
    }

std::string exec(const char* cmd) {
    char buffer[128];
    std::string result = "";
    
    #ifdef __APPLE__
        FILE* pipe = popen(cmd, "r");
    #elif _WIN32
        FILE* pipe = _popen(cmd, "r");
    #endif
    
    
    if (!pipe) throw std::runtime_error("popen() failed!");
    try {
        while (fgets(buffer, sizeof buffer, pipe) != NULL) {
            result += buffer;
        }
    }
    catch (...) {
        #ifdef __APPLE__
            pclose(pipe);
        #elif _WIN32
            _pclose(pipe);
        #endif
        throw;
    }
    #ifdef __APPLE__
        pclose(pipe);
    #elif _WIN32
        _pclose(pipe);
    #endif
    return result;
}

static const std::string kBase64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789+/";

inline bool IsBase64(unsigned char c) {
    return (std::isalnum(c) || (c == '+') || (c == '/'));
}

std::vector<unsigned char> Base64Decode(const std::string& encoded) {
    size_t in_len = encoded.size();
    size_t i = 0;
    size_t j = 0;
    size_t in_ = 0;
    unsigned char char_array_4[4], char_array_3[3];
    std::vector<unsigned char> ret;

    while (in_len-- && (encoded[in_] != '=') && IsBase64(static_cast<unsigned char>(encoded[in_]))) {
        char_array_4[i++] = static_cast<unsigned char>(encoded[in_]);
        ++in_;
        if (i == 4) {
            for (i = 0; i < 4; ++i) {
                const auto idx = kBase64Chars.find(static_cast<char>(char_array_4[i]));
                if (idx == std::string::npos) {
                    return ret;
                }
                char_array_4[i] = static_cast<unsigned char>(idx);
            }

            char_array_3[0] = static_cast<unsigned char>((char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4));
            char_array_3[1] = static_cast<unsigned char>(((char_array_4[1] & 0x0F) << 4) + ((char_array_4[2] & 0x3C) >> 2));
            char_array_3[2] = static_cast<unsigned char>(((char_array_4[2] & 0x03) << 6) + char_array_4[3]);

            for (i = 0; i < 3; ++i) {
                ret.push_back(char_array_3[i]);
            }
            i = 0;
        }
    }

    if (i) {
        for (j = 0; j < i; ++j) {
            const auto idx = kBase64Chars.find(static_cast<char>(char_array_4[j]));
            if (idx == std::string::npos) {
                break;
            }
            char_array_4[j] = static_cast<unsigned char>(idx);
        }

        char_array_3[0] = static_cast<unsigned char>((char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4));
        char_array_3[1] = static_cast<unsigned char>(((char_array_4[1] & 0x0F) << 4) + ((char_array_4[2] & 0x3C) >> 2));
        char_array_3[2] = static_cast<unsigned char>(((char_array_4[2] & 0x03) << 6) + char_array_4[3]);

        for (j = 0; j < i - 1; ++j) {
            ret.push_back(char_array_3[j]);
        }
    }

    return ret;
}

std::string GetStringArgument(addon_env env, addon_value value) {
    size_t length = 0;
    Check(UxpAddonApis.uxp_addon_get_value_string_utf8(env, value, nullptr, 0, &length));

    std::string result(length, '\0');
    Check(UxpAddonApis.uxp_addon_get_value_string_utf8(env, value, result.data(), length + 1, &length));
    result.resize(length);
    return result;
}

std::filesystem::path ResolveDefaultStoragePath() {
#ifdef _WIN32
    const char* baseDir = std::getenv("USERPROFILE");
    std::filesystem::path path = baseDir && *baseDir ? std::filesystem::path(baseDir) : std::filesystem::temp_directory_path();
    path /= "Documents";
#else
    const char* baseDir = std::getenv("HOME");
    std::filesystem::path path = baseDir && *baseDir ? std::filesystem::path(baseDir) : std::filesystem::temp_directory_path();
    path /= "Documents";
#endif
    path /= "BoltUXP";
    path /= "Generations";
    return path;
}

addon_value GetDefaultStoragePath(addon_env env, addon_callback_info /*info*/) {
    try {
        const auto storagePath = ResolveDefaultStoragePath();
        auto pathString = storagePath.u8string();

        addon_value result = nullptr;
        Check(UxpAddonApis.uxp_addon_create_string_utf8(env, pathString.c_str(), pathString.size(), &result));
        return result;
    } catch (...) {
        return CreateErrorFromException(env);
    }
}

addon_value EnsureDirectory(addon_env env, addon_callback_info info) {
    try {
        size_t argc = 1;
        addon_value argv[1];
        Check(UxpAddonApis.uxp_addon_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

        if (argc < 1) {
            return CreateErrorFromException(env);
        }

        const std::string directory = GetStringArgument(env, argv[0]);
        std::filesystem::path dirPath(directory);

        std::error_code ec;
        std::filesystem::create_directories(dirPath, ec);

        const bool exists = std::filesystem::exists(dirPath);
        addon_value result = nullptr;
        Check(UxpAddonApis.uxp_addon_get_boolean(env, exists && !ec, &result));
        return result;
    } catch (...) {
        return CreateErrorFromException(env);
    }
}

addon_value WriteFile(addon_env env, addon_callback_info info) {
    try {
        size_t argc = 3;
        addon_value argv[3];
        Check(UxpAddonApis.uxp_addon_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

        if (argc < 2) {
            return CreateErrorFromException(env);
        }

        const std::string filePathStr = GetStringArgument(env, argv[0]);
        const std::string payload = GetStringArgument(env, argv[1]);

        bool treatAsBase64 = false;
        if (argc >= 3) {
            Check(UxpAddonApis.uxp_addon_get_value_bool(env, argv[2], &treatAsBase64));
        }

        std::filesystem::path filePath(filePathStr);
        const auto parent = filePath.parent_path();
        if (!parent.empty()) {
            std::error_code ec;
            std::filesystem::create_directories(parent, ec);
            if (ec) {
                addon_value failure = nullptr;
                Check(UxpAddonApis.uxp_addon_get_boolean(env, false, &failure));
                return failure;
            }
        }

        std::ofstream output(filePath, std::ios::binary | std::ios::out);
        if (!output.is_open()) {
            addon_value result = nullptr;
            Check(UxpAddonApis.uxp_addon_get_boolean(env, false, &result));
            return result;
        }

        if (treatAsBase64) {
            const auto bytes = Base64Decode(payload);
            output.write(reinterpret_cast<const char*>(bytes.data()), static_cast<std::streamsize>(bytes.size()));
        } else {
            output.write(payload.data(), static_cast<std::streamsize>(payload.size()));
        }

        output.close();

        const bool success = output.good() && std::filesystem::exists(filePath);
        addon_value result = nullptr;
        Check(UxpAddonApis.uxp_addon_get_boolean(env, success, &result));
        return result;
    } catch (...) {
        return CreateErrorFromException(env);
    }
}

addon_value ExecSync(addon_env env, addon_callback_info info)
{
    addon_status status;
    addon_value msg;
    size_t argc = 1;
    addon_value argv[1];

    status = UxpAddonApis.uxp_addon_get_cb_info(env, info, &argc, argv, NULL, NULL);
    if (status != addon_ok)
    {
        UxpAddonApis.uxp_addon_throw_error(env, NULL, "Failed to pass the arguments");
    }

    // Get length of param
    size_t name_length;
    status = UxpAddonApis.uxp_addon_get_value_string_utf8(env, argv[0], NULL, 0, &name_length);

    char *name = new char[name_length + 1];
    if (name == nullptr)
    {
        UxpAddonApis.uxp_addon_throw_error(env, NULL, "Invalid function name allocation");
        return nullptr;
    }

    // Get value of param
    status = UxpAddonApis.uxp_addon_get_value_string_utf8(env, argv[0], name, name_length + 1, &name_length);
    name[name_length] = '\0';

    std::string output;

#ifdef __APPLE__
    // Mac Code
    output = exec(name);
#elif _WIN32
    output = execWin(name);
#else

#endif


    status = UxpAddonApis.uxp_addon_create_string_utf8(env, output.c_str(), output.size(), &msg);
    if (status != addon_ok) {
        UxpAddonApis.uxp_addon_throw_error(env, NULL, "Unable to create string");
    }
    delete[] name; // Don't forget to delete the dynamically allocated memory
    return msg;

    //return nullptr;
}

/*
 * The function is used to return 'hello world' message.
 * Javascript equivalent function() { return 'hello world'; }; in C++
 * No entry point should throw an exception. The implementation must use try/catch
 * and return nullptr if an exception was caught.
 * This method is invoked on the JavaScript thread.
 */
addon_value MyFunction(addon_env env, addon_callback_info info) {
    try {
        addon_value message = nullptr;
        Check(UxpAddonApis.uxp_addon_create_string_utf8(env, "hello world", 11, &message));
        return message;
    } catch (...) {
        return CreateErrorFromException(env);
    }
}

/*
 * This function will echo the provided argument after converting to and from a
 * standard value type.
 * No entry point should throw an exception. The implementation must use try/catch
 * and return nullptr if an exception was caught.
 * This method is invoked on the JavaScript thread.
 */
addon_value MyEcho(addon_env env, addon_callback_info info) {
    try {
        // Allocate space for the first argument
        addon_value arg1;
        size_t argc = 1;
        Check(UxpAddonApis.uxp_addon_get_cb_info(env, info, &argc, &arg1, nullptr, nullptr));

        // Convert the first argument to a value that can be retained past the
        // return from this function. This is needed if you want to pass arguments
        // to an asynchronous/deferred task handler
        Value stdValue(env, arg1);

        return stdValue.Convert(env);
    } catch (...) {
        return CreateErrorFromException(env);
    }
}

/*
 * This function will echo the provided argument after converting to and from a
 * standard value type.
 * The implementation illustrates how to create an asynchronous task, where the
 * initial call returns a promise/deferred which is then later resolved.
 * No entry point should throw an exception. The implementation must use try/catch
 * and return nullptr if an exception was caught.
 * This method is invoked on the JavaScript thread.
 */
addon_value MyAsyncEcho(addon_env env, addon_callback_info info) {
    try {
        // Allocate space for the first argument
        addon_value arg1;
        size_t argc = 1;
        Check(UxpAddonApis.uxp_addon_get_cb_info(env, info, &argc, &arg1, nullptr, nullptr));

        // Convert the first argument to a value that can be retained past the
        // return from this function. This is needed if you want to pass arguments
        // to an asynchronous/deferred task hand;er
        Value stdValue(env, arg1);

        // Create a heap copy using move. This prevents a deep copy of the data & we can pass that
        // ptr to another context
        std::shared_ptr<Value> valuePtr(std::make_shared<Value>(std::move(stdValue)));

        auto scriptThreadHandler = [](Task& task, addon_env env, addon_deferred deferred) {
            try {
                HandlerScope scope(env);
                bool isError = false;
                const Value& result = task.GetResult(isError);
                addon_value resultValue = result.Convert(env);

                if (isError)
                    Check(UxpAddonApis.uxp_addon_reject_deferred(env, deferred, resultValue));
                else
                    Check(UxpAddonApis.uxp_addon_resolve_deferred(env, deferred, resultValue));
            } catch (...) {
            }
        };

        auto mainThreadHandler = [valuePtr, scriptThreadHandler](Task& task) {
            try {
                task.SetResult(std::move(*(valuePtr.get())), false);
                task.ScheduleOnScriptingThread(scriptThreadHandler);
            } catch (...) {
            }
        };

        auto task = Task::Create();
        return task->ScheduleOnMainThread(env, mainThreadHandler);
    } catch (...) {
        return CreateErrorFromException(env);
    }
}

/* Method invoked when the addon module is being requested by JavaScript
 * This method is invoked on the JavaScript thread.
 */
addon_value Init(addon_env env, addon_value exports, const addon_apis& addonAPIs) {
    addon_status status = addon_ok;
    addon_value fn = nullptr;

    // MyFunction
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, MyFunction, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap native function");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "my_function", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to populate exports");
        }
    }

    // MyEcho
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, MyEcho, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap native function");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "my_echo", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to populate exports");
        }
    }

    // MyAsyncEcho
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, MyAsyncEcho, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap native function");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "my_echo_async", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to populate exports");
        }
    }

        // execSync
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, ExecSync, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap native function");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "execSync", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to populate exports");
        }
    }

    // ensureDirectory
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, EnsureDirectory, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap ensureDirectory");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "ensureDirectory", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to expose ensureDirectory");
        }
    }

    // writeFile
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, WriteFile, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap writeFile");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "writeFile", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to expose writeFile");
        }
    }

    // getDefaultStoragePath
    {
        status = addonAPIs.uxp_addon_create_function(env, NULL, 0, GetDefaultStoragePath, NULL, &fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to wrap getDefaultStoragePath");
        }

        status = addonAPIs.uxp_addon_set_named_property(env, exports, "getDefaultStoragePath", fn);
        if (status != addon_ok) {
            addonAPIs.uxp_addon_throw_error(env, NULL, "Unable to expose getDefaultStoragePath");
        }
    }

    return exports;
}

}  // namespace

/*
 * Register initialization routine
 * Invoked by UXP during uxpaddon load.
 */
UXP_ADDON_INIT(Init)

void terminate(addon_env env) {
    try {
    } catch (...) {
    }
}

/* Register addon termination routine
 * Invoked by UXP during uxpaddon un-load.
 */
UXP_ADDON_TERMINATE(terminate)
