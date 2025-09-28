// @ts-ignore
import React, { useState, useMemo } from 'react';
import './Gallery.scss';

interface ImageData {
  id: number;
  url: string;
  prompt: string;
  contentType: string;
  aspectRatio: string;
  createdAt: Date;
  tags: string[];
}

// Mock image data to match the screenshot
const mockImages: ImageData[] = [
  {
    id: 1,
    url: 'https://via.placeholder.com/300x200?text=City+Skyline',
    prompt: 'City skyline at sunset with reflections in water',
    contentType: 'art',
    aspectRatio: 'landscape',
    createdAt: new Date('2024-01-15'),
    tags: ['city', 'sunset', 'urban']
  },
  {
    id: 2,
    url: 'https://via.placeholder.com/300x300?text=Creature',
    prompt: 'Mystical forest creature with glowing eyes',
    contentType: 'art',
    aspectRatio: 'square',
    createdAt: new Date('2024-01-14'),
    tags: ['creature', 'fantasy', 'forest']
  },
  {
    id: 3,
    url: 'https://via.placeholder.com/300x300?text=Leaf+Frame',
    prompt: 'Elegant leaf in white frame',
    contentType: 'art',
    aspectRatio: 'square',
    createdAt: new Date('2024-01-13'),
    tags: ['leaf', 'minimal', 'nature']
  },
  {
    id: 4,
    url: 'https://via.placeholder.com/300x200?text=Lake+Sunset',
    prompt: 'Peaceful lake at sunset with reeds',
    contentType: 'photo',
    aspectRatio: 'landscape',
    createdAt: new Date('2024-01-12'),
    tags: ['lake', 'sunset', 'peaceful']
  },
  {
    id: 5,
    url: 'https://via.placeholder.com/300x200?text=City+Street',
    prompt: 'Modern city street with neon lights',
    contentType: 'photo',
    aspectRatio: 'landscape',
    createdAt: new Date('2024-01-11'),
    tags: ['city', 'street', 'neon']
  },
  {
    id: 6,
    url: 'https://via.placeholder.com/300x300?text=Astronaut',
    prompt: 'Astronaut portrait in space suit',
    contentType: 'art',
    aspectRatio: 'square',
    createdAt: new Date('2024-01-10'),
    tags: ['astronaut', 'space', 'portrait']
  },
  {
    id: 7,
    url: 'https://via.placeholder.com/300x200?text=Forest+Path',
    prompt: 'Enchanted forest path with tall trees',
    contentType: 'photo',
    aspectRatio: 'landscape',
    createdAt: new Date('2024-01-09'),
    tags: ['forest', 'path', 'trees']
  },
  {
    id: 8,
    url: 'https://via.placeholder.com/300x300?text=Robot',
    prompt: 'Friendly robot character design',
    contentType: 'art',
    aspectRatio: 'square',
    createdAt: new Date('2024-01-08'),
    tags: ['robot', 'character', 'friendly']
  }
];

interface GalleryProps {}

export const Gallery = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('All');
  const [aspectRatio, setAspectRatio] = useState('All');
  const [dateRange, setDateRange] = useState('All time');
  const [sortBy, setSortBy] = useState('Newest');

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let filtered = mockImages.filter(image => {
      // Search filter
      if (searchQuery && !image.prompt.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Content type filter
      if (contentType !== 'All' && image.contentType !== contentType.toLowerCase()) {
        return false;
      }

      // Aspect ratio filter
      if (aspectRatio !== 'All' && image.aspectRatio !== aspectRatio.toLowerCase()) {
        return false;
      }

      // Date range filter (simplified)
      if (dateRange !== 'All time') {
        const now = new Date();
        const daysDiff = (now.getTime() - image.createdAt.getTime()) / (1000 * 3600 * 24);
        
        if (dateRange === '7 days' && daysDiff > 7) return false;
        if (dateRange === '30 days' && daysDiff > 30) return false;
        if (dateRange === '90 days' && daysDiff > 90) return false;
      }

      return true;
    });

    // Sort images
    if (sortBy === 'Newest') {
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (sortBy === 'Oldest') {
      filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }

    return filtered;
  }, [searchQuery, contentType, aspectRatio, dateRange, sortBy]);

  const handleApplyFilters = () => {
    // Filters are already applied via useMemo
    console.log('Filters applied');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setContentType('All');
    setAspectRatio('All');
    setDateRange('All time');
    setSortBy('Newest');
  };

  return (
    <div className="gallery-container">
      {/* Filters Sidebar */}
      <aside className="gallery-sidebar">
        <h3 className="sidebar-title">Filters</h3>
        
        {/* Search */}
        <div className="filter-group">
          <label className="filter-label">Search</label>
          {/* @ts-ignore */}
          <sp-textfield
            placeholder="Search by prompt..."
            value={searchQuery}
            onInput={(e: any) => setSearchQuery(e.target.value)}
          >
          {/* @ts-ignore */}
          </sp-textfield>
        </div>

        {/* Content Type */}
        <div className="filter-group">
          <label className="filter-label">Content Type</label>
          {/* @ts-ignore */}
          <sp-picker
            value={contentType}
            onChange={(e: any) => setContentType(e.target.value)}
          >
            {/* @ts-ignore */}
            <sp-menu slot="options">
              {/* @ts-ignore */}
              <sp-menu-item value="All">All</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Art">Art</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Photo">Photo</sp-menu-item>
            {/* @ts-ignore */}
            </sp-menu>
          {/* @ts-ignore */}
          </sp-picker>
        </div>

        {/* Aspect Ratio */}
        <div className="filter-group">
          <label className="filter-label">Aspect Ratio</label>
          {/* @ts-ignore */}
          <sp-picker
            value={aspectRatio}
            onChange={(e: any) => setAspectRatio(e.target.value)}
          >
            {/* @ts-ignore */}
            <sp-menu slot="options">
              {/* @ts-ignore */}
              <sp-menu-item value="All">All</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Square">Square</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Landscape">Landscape</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="Portrait">Portrait</sp-menu-item>
            {/* @ts-ignore */}
            </sp-menu>
          {/* @ts-ignore */}
          </sp-picker>
        </div>

        {/* Date Range */}
        <div className="filter-group">
          <label className="filter-label">Date Range</label>
          {/* @ts-ignore */}
          <sp-picker
            value={dateRange}
            onChange={(e: any) => setDateRange(e.target.value)}
          >
            {/* @ts-ignore */}
            <sp-menu slot="options">
              {/* @ts-ignore */}
              <sp-menu-item value="All time">All time</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="7 days">Last 7 days</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="30 days">Last 30 days</sp-menu-item>
              {/* @ts-ignore */}
              <sp-menu-item value="90 days">Last 90 days</sp-menu-item>
            {/* @ts-ignore */}
            </sp-menu>
          {/* @ts-ignore */}
          </sp-picker>
        </div>

        {/* Filter Actions */}
        <div className="filter-actions">
          {/* @ts-ignore */}
          <sp-button variant="accent" onClick={handleApplyFilters}>
            Apply Filters
          {/* @ts-ignore */}
          </sp-button>
          {/* @ts-ignore */}
          <sp-button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          {/* @ts-ignore */}
          </sp-button>
        </div>
      </aside>

      {/* Main Gallery Area */}
      <main className="gallery-main">
        {/* Gallery Header */}
        <header className="gallery-header">
          <h2 className="gallery-title">Image Gallery</h2>
          <div className="gallery-sort">
            <span className="sort-label">Sort by:</span>
            {/* @ts-ignore */}
            <sp-picker
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              size="s"
            >
              {/* @ts-ignore */}
              <sp-menu slot="options">
                {/* @ts-ignore */}
                <sp-menu-item value="Newest">Newest</sp-menu-item>
                {/* @ts-ignore */}
                <sp-menu-item value="Oldest">Oldest</sp-menu-item>
              {/* @ts-ignore */}
              </sp-menu>
            {/* @ts-ignore */}
            </sp-picker>
          </div>
        </header>

        {/* Image Grid */}
        <div className="gallery-grid">
          {filteredImages.map((image: ImageData) => (
            <div key={image.id} className="gallery-item">
              <div className="item-image">
                <img src={image.url} alt={image.prompt} />
                <div className="item-overlay">
                  {/* @ts-ignore */}
                  <sp-action-button quiet>
                    {/* @ts-ignore */}
                    <sp-icon name="ui:ViewDetail" size="m"></sp-icon>
                  {/* @ts-ignore */}
                  </sp-action-button>
                </div>
              </div>
              <div className="item-info">
                <div className="item-prompt">{image.prompt}</div>
                <div className="item-meta">
                  <span className="item-type">{image.contentType}</span>
                  <span className="item-date">{image.createdAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="gallery-empty">
            {/* @ts-ignore */}
            <sp-icon name="ui:Image" size="xl"></sp-icon>
            <h3>No images found</h3>
            <p>Try adjusting your filters to see more results.</p>
          </div>
        )}
      </main>
    </div>
  );
};