// ============================================
// Memories
// ============================================

async function loadMemories() {
    try {
        const snapshot = await memoriesCollection.orderBy('memoryDate', 'desc').get();
        memories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('📸 Loaded', memories.length, 'memories');
        
        renderMemoriesTimeline();
    } catch (error) {
        console.error('❌ Error loading memories:', error);
    }
}
async function handlePhotoSelect(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Validate video duration (max 20 seconds) before showing form
    const videoFiles = files.filter(f => f.type.startsWith('video/'));
    if (videoFiles.length > 0) {
        const validationPromises = videoFiles.map(vf => new Promise((resolve) => {
            const tempVideo = document.createElement('video');
            tempVideo.preload = 'metadata';
            tempVideo.onloadedmetadata = () => {
                URL.revokeObjectURL(tempVideo.src);
                resolve(tempVideo.duration <= 20);
            };
            tempVideo.onerror = () => {
                URL.revokeObjectURL(tempVideo.src);
                resolve(false);
            };
            tempVideo.src = URL.createObjectURL(vf);
        }));
        
        const results = await Promise.all(validationPromises);
        if (results.some(valid => !valid)) {
            showError('Videos must be 20 seconds or shorter');
            return;
        }
    }
    
    selectedPhotos = files;
    
    document.getElementById('photo-selection').classList.add('hidden');
    document.getElementById('memory-form').classList.remove('hidden');
    
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.innerHTML = '';
    
    files.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        
        if (isVideo) {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item video-preview-item';
            preview.dataset.zoom = '1';
            const videoUrl = URL.createObjectURL(file);
            preview.innerHTML = `
                <video src="${videoUrl}" muted playsinline autoplay loop></video>
                <div class="video-badge">🎬 Video</div>
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
            `;
            previewContainer.appendChild(preview);
        } else if (isAudio) {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item audio-preview-item';
            preview.dataset.zoom = '1';
            const audioUrl = URL.createObjectURL(file);
            preview.innerHTML = `
                <div class="audio-preview-placeholder">🎵</div>
                <audio src="${audioUrl}" controls></audio>
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
            `;
            previewContainer.appendChild(preview);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.className = 'photo-preview-item';
                preview.dataset.zoom = '1';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
                `;
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    
    if (selectedPhotos.length === 0) {
        resetMemoryForm();
        return;
    }
    
    // Re-render all previews with correct indices to avoid stale onclick references
    rerenderPhotoPreviews();
}

function rerenderPhotoPreviews() {
    const previewContainer = document.getElementById('photos-preview');
    previewContainer.innerHTML = '';
    
    selectedPhotos.forEach((file, index) => {
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        
        if (isVideo) {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item video-preview-item';
            preview.dataset.zoom = '1';
            const videoUrl = URL.createObjectURL(file);
            preview.innerHTML = `
                <video src="${videoUrl}" muted playsinline autoplay loop></video>
                <div class="video-badge">🎬 Video</div>
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
            `;
            previewContainer.appendChild(preview);
        } else if (isAudio) {
            const preview = document.createElement('div');
            preview.className = 'photo-preview-item audio-preview-item';
            preview.dataset.zoom = '1';
            const audioUrl = URL.createObjectURL(file);
            preview.innerHTML = `
                <div class="audio-preview-placeholder">🎵</div>
                <audio src="${audioUrl}" controls></audio>
                <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
            `;
            previewContainer.appendChild(preview);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.className = 'photo-preview-item';
                preview.dataset.zoom = '1';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview ${index + 1}">
                    <button type="button" class="btn-remove-photo" onclick="removePhoto(${index})">×</button>
                `;
                previewContainer.appendChild(preview);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Zoom in/out on photo preview when adding memories
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;

window.zoomPreview = function(btn, delta) {
    const item = btn.closest('.photo-preview-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    
    let currentZoom = parseFloat(item.dataset.zoom) || ZOOM_MIN;
    currentZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, currentZoom + delta));
    item.dataset.zoom = currentZoom.toString();
    img.style.transform = `scale(${currentZoom})`;
};

window.zoomPreviewSlider = function(slider) {
    const item = slider.closest('.photo-preview-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    
    const zoom = parseFloat(slider.value) || 1;
    item.dataset.zoom = zoom.toString();
    img.style.transform = `scale(${zoom})`;
};

// Cloudinary deletion helpers

// Extract public_id from a Cloudinary URL (backward compat for existing memories)
function extractCloudinaryPublicId(url) {
    try {
        // URLs look like: https://res.cloudinary.com/{cloud}/image/upload/v12345/folder/filename.ext
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

// Detect resource_type from a Cloudinary URL
function extractCloudinaryResourceType(url) {
    if (url.includes('/video/upload/')) return 'video';
    return 'image';
}

// Generate SHA-1 signature for Cloudinary signed requests
async function generateCloudinarySignature(paramsToSign) {
    const sortedKeys = Object.keys(paramsToSign).sort();
    const signatureString = sortedKeys.map(k => `${k}=${paramsToSign[k]}`).join('&') + CLOUDINARY_API_SECRET;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Delete a single asset from Cloudinary
async function deleteFromCloudinary(publicId, resourceType) {
    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        console.warn('⚠️ Cloudinary API credentials not configured — skipping Cloudinary deletion for:', publicId);
        return false;
    }
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const paramsToSign = { public_id: publicId, timestamp: timestamp };
        const signature = await generateCloudinarySignature(paramsToSign);

        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('timestamp', timestamp);

        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`,
            { method: 'POST', body: formData }
        );
        const result = await res.json();
        if (result.result === 'ok') {
            console.log('✅ Cloudinary asset deleted:', publicId);
            return true;
        }
        console.warn('⚠️ Cloudinary deletion response:', result);
        return false;
    } catch (error) {
        console.warn('⚠️ Cloudinary deletion failed for:', publicId, error);
        return false;
    }
}

// Delete all Cloudinary assets for a memory
async function deleteMemoryFromCloudinary(memory) {
    if (!memory || !memory.images || memory.images.length === 0) return;

    if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        console.warn('⚠️ Cloudinary API credentials not configured — skipping Cloudinary deletion. Set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in app.js to enable cleanup.');
        return;
    }

    const deletePromises = memory.images.map((url, i) => {
        // Prefer stored public_id, fall back to extracting from URL
        const publicId = (memory.publicIds && memory.publicIds[i])
            ? memory.publicIds[i]
            : extractCloudinaryPublicId(url);
        if (!publicId) return Promise.resolve(false);

        const resourceType = (memory.mediaTypes && memory.mediaTypes[i] === 'video')
            ? 'video'
            : extractCloudinaryResourceType(url);
        return deleteFromCloudinary(publicId, resourceType);
    });

    await Promise.allSettled(deletePromises);
}

async function handleMemoryUpload(e) {
    e.preventDefault();
    
    if (selectedPhotos.length === 0) return;
    
    const caption = document.getElementById('memory-caption').value.trim();
    const memoryDateInput = document.getElementById('memory-date').value;
    
    const [year, month, day] = memoryDateInput.split('-').map(Number);
    const memoryDate = new Date(year, month - 1, day, 12, 0, 0);
    
    showLoading(true);
    
    try {
        // Upload all files in parallel for faster performance
        const uploadPromises = selectedPhotos.map(photo => {
            const isVideo = photo.type.startsWith('video/');
            const isAudio = photo.type.startsWith('audio/');
            const uploadType = (isVideo || isAudio) ? 'video' : 'image';
            const mediaType = isVideo ? 'video' : (isAudio ? 'audio' : 'image');
            
            const formData = new FormData();
            formData.append('file', photo);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', CLOUDINARY_FOLDER);
            
            return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${uploadType}/upload`, {
                method: 'POST',
                body: formData
            }).then(async response => {
                if (!response.ok) throw new Error('Upload failed');
                const data = await response.json();
                return { url: data.secure_url, publicId: data.public_id, mediaType };
            });
        });

        const results = await Promise.all(uploadPromises);
        const imageUrls = results.map(r => r.url);
        const mediaTypes = results.map(r => r.mediaType);
        const publicIds = results.map(r => r.publicId);
        
        const memory = {
            images: imageUrls,
            mediaTypes: mediaTypes,
            publicIds: publicIds,
            caption: caption,
            memoryDate: firebase.firestore.Timestamp.fromDate(memoryDate),
            uploadedBy: currentUserProfile.role,
            imagePosition: { x: 50, y: 50 },
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await memoriesCollection.add(memory);
        
        console.log('✅ Memory uploaded');
        resetMemoryForm();
        document.getElementById('memory-modal').classList.add('hidden');
        await loadMemories();
        switchTab('us');
    } catch (error) {
        console.error('❌ Upload error:', error);
        showError('Failed to upload memory');
    }
    
    showLoading(false);
}

function resetMemoryForm() {
    selectedPhotos = [];
    document.getElementById('memory-form').reset();
    document.getElementById('photos-preview').innerHTML = '';
    document.getElementById('photo-selection').classList.remove('hidden');
    document.getElementById('memory-form').classList.add('hidden');
}

function getRandomTilt() {
    return (Math.random() * 6 - 3).toFixed(2);
}

function getStableTilt(id) {
    // Generate a stable tilt based on the memory id so it doesn't change on re-render
    // Uses hash * 31 algorithm (common string hash) to produce a tilt in range -3 to +3 degrees
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = ((hash << 5) - hash) + id.charCodeAt(i);
        hash |= 0;
    }
    return ((Math.abs(hash) % 600) / 100 - 3).toFixed(2);
}

function renderMemoriesTimeline() {
    const container = document.getElementById('memories-timeline');
    
    if (memories.length === 0) {
        container.innerHTML = `
            <div class="empty-memories">
                <p>No memories yet.</p>
                <p class="empty-memories-sub">Start capturing your moments together</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = memories.map((memory, index) => {
        const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
        const formattedDate = formatMemoryDate(date);
        const imageCount = memory.images.length;
        const tilt = getStableTilt(memory.id);
        const isAnniversaryMemory = isQuarterlyAnniversary(date);
        const anniversaryClass = isAnniversaryMemory ? ' anniversary-polaroid' : '';
        const anniversaryBadge = isAnniversaryMemory ? '<div class="anniversary-memory-badge">💝 Anniversary</div>' : '';
        
        // Timeline string logic - show string between consecutive dates
        let showString = false;
        if (index < memories.length - 1) {
            const nextMemory = memories[index + 1];
            const nextDate = nextMemory.memoryDate ? nextMemory.memoryDate.toDate() : new Date();
            if (nextDate < date) {
                showString = true;
            }
        }
        
        const stringHTML = showString ? '<div class="polaroid-string"></div>' : '';
        
        const imgStyle = getImageStyle(memory);
        const firstIsVideo = isVideoMedia(memory, 0);
        const firstMediaHTML = renderMediaElement(memory.images[0], firstIsVideo, memory.caption || 'Memory', imgStyle, '', true);
        
        if (imageCount === 1) {
            return `
                <div class="polaroid-wrapper">
                    ${stringHTML}
                    <div class="polaroid${anniversaryClass}" style="transform: rotate(${tilt}deg)" onclick="viewSinglePhoto('${memory.id}')">
                        <div class="polaroid-photo">
                            ${firstMediaHTML}
                        </div>
                        <div class="polaroid-caption-area">
                            <p class="polaroid-date">${formattedDate}</p>
                            ${memory.caption ? `<p class="polaroid-caption">${memory.caption}</p>` : ''}
                        </div>
                        ${anniversaryBadge}
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="polaroid-wrapper">
                    ${stringHTML}
                    <div class="photo-stack" style="transform: rotate(${tilt}deg)" onclick="viewAlbum('${memory.id}')">
                        <div class="stack-card stack-back-2"></div>
                        <div class="stack-card stack-back-1"></div>
                        <div class="polaroid${anniversaryClass}">
                            <div class="polaroid-photo">
                                ${firstMediaHTML}
                            </div>
                            <div class="polaroid-caption-area">
                                <p class="polaroid-date">${formattedDate}</p>
                                ${memory.caption ? `<p class="polaroid-caption">${memory.caption}</p>` : ''}
                            </div>
                            <div class="album-count-badge">${imageCount} ${imageCount === 1 ? 'item' : 'items'}</div>
                            ${anniversaryBadge}
                        </div>
                    </div>
                </div>
            `;
        }
    }).join('');

    // Set up IntersectionObserver for lazy video playback
    observeTimelineVideos();
}

// NEW: Image Adjustment Feature
window.startImageAdjust = function(memoryId, imageIndex) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;
    
    // Skip adjustment for videos
    if (isVideoMedia(memory, imageIndex)) {
        showError('Video position adjustment is not supported');
        return;
    }
    
    const currentPos = memory.imagePosition || { x: 50, y: 50 };
    const currentZoom = memory.imageZoom || 1;
    
    const modal = document.createElement('div');
    modal.className = 'image-adjust-modal';
    modal.innerHTML = `
        <div class="image-adjust-content">
            <h3>Adjust Image Position</h3>
            <div class="image-adjust-preview">
                <img src="${memory.images[imageIndex]}" id="adjust-preview-img" style="object-fit: cover; object-position: ${currentPos.x}% ${currentPos.y}%; transform: scale(${currentZoom});">
            </div>
            <div class="adjust-controls">
                <label>
                    <span>Horizontal</span>
                    <input type="range" id="adjust-x" min="0" max="100" value="${currentPos.x}">
                </label>
                <label>
                    <span>Vertical</span>
                    <input type="range" id="adjust-y" min="0" max="100" value="${currentPos.y}">
                </label>
                <label>
                    <span>Zoom</span>
                    <input type="range" id="adjust-zoom" min="1" max="2.5" step="0.05" value="${currentZoom}">
                </label>
            </div>
            <div class="adjust-buttons">
                <button class="btn-save-adjust" onclick="saveImagePosition('${memoryId}')">Save</button>
                <button class="btn-cancel-adjust" onclick="closeImageAdjust()">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const img = document.getElementById('adjust-preview-img');
    const xSlider = document.getElementById('adjust-x');
    const ySlider = document.getElementById('adjust-y');
    const zoomSlider = document.getElementById('adjust-zoom');
    
    xSlider.addEventListener('input', (e) => {
        img.style.objectPosition = `${e.target.value}% ${ySlider.value}%`;
    });
    
    ySlider.addEventListener('input', (e) => {
        img.style.objectPosition = `${xSlider.value}% ${e.target.value}%`;
    });
    
    zoomSlider.addEventListener('input', (e) => {
        img.style.transform = `scale(${e.target.value})`;
    });
};

window.saveImagePosition = async function(memoryId) {
    const xValue = parseInt(document.getElementById('adjust-x').value);
    const yValue = parseInt(document.getElementById('adjust-y').value);
    const zoomValue = parseFloat(document.getElementById('adjust-zoom').value);
    
    showLoading(true);
    
    try {
        await memoriesCollection.doc(memoryId).update({
            imagePosition: { x: xValue, y: yValue },
            imageZoom: zoomValue
        });
        
        console.log('✅ Image position saved');
        closeImageAdjust();
        await loadMemories();
    } catch (error) {
        console.error('❌ Failed to save position:', error);
        showError('Failed to save position');
    }
    
    showLoading(false);
};

window.closeImageAdjust = function() {
    const modal = document.querySelector('.image-adjust-modal');
    if (modal) modal.remove();
};

function viewSinglePhoto(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    
    const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
    const formattedDate = formatMemoryDate(date);
    
    const imgStyle = getImageStyle(memory);
    const isVideo = isVideoMedia(memory, 0);
    const mediaHTML = renderMediaElement(memory.images[0], isVideo, 'Memory', imgStyle, '');
    
    const container = document.getElementById('single-photo-container');
    container.innerHTML = `
        <div class="viewer-polaroid">
            <div class="viewer-polaroid-photo">
                ${mediaHTML}
            </div>
            <div class="viewer-polaroid-caption">
                <p class="viewer-date">${formattedDate}</p>
                ${memory.caption ? `<p class="viewer-caption-text">${memory.caption}</p>` : ''}
            </div>
        </div>
    `;
    
    document.getElementById('photo-viewer-modal').classList.remove('hidden');
}

function viewAlbum(memoryId) {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory || memory.images.length === 0) return;
    
    currentViewingMemoryId = memoryId;
    currentAlbumIndex = 0;
    
    renderAlbumPhoto(memory);
    updatePhotoCounter(memory.images.length);
    
    const date = memory.memoryDate ? memory.memoryDate.toDate() : new Date();
    const formattedDate = formatMemoryDate(date);
    
    const infoContainer = document.getElementById('album-viewer-info');
    infoContainer.innerHTML = `
        <p class="viewer-date">${formattedDate}</p>
        ${memory.caption ? `<p class="viewer-caption-text">${memory.caption}</p>` : ''}
    `;
    
    document.getElementById('album-viewer-modal').classList.remove('hidden');
    
    // Setup swipe
    setupAlbumSwipe();
}

function renderAlbumPhoto(memory) {
    const container = document.getElementById('album-photos-container');
    const currentImage = memory.images[currentAlbumIndex];
    
    const imgStyle = getImageStyle(memory);
    const isVideo = isVideoMedia(memory, currentAlbumIndex);
    const mediaHTML = renderMediaElement(currentImage, isVideo, `Photo ${currentAlbumIndex + 1}`, imgStyle, '');
    
    container.innerHTML = `
        <div class="viewer-polaroid swipeable-polaroid">
            <div class="viewer-polaroid-photo">
                ${mediaHTML}
            </div>
        </div>
    `;
}

let _albumSwipeStartHandler = null;
let _albumSwipeEndHandler = null;

function setupAlbumSwipe() {
    const container = document.getElementById('album-photos-container');
    let startX = 0;
    
    // Remove previous listeners to prevent accumulation
    if (_albumSwipeStartHandler) {
        container.removeEventListener('touchstart', _albumSwipeStartHandler);
    }
    if (_albumSwipeEndHandler) {
        container.removeEventListener('touchend', _albumSwipeEndHandler);
    }
    
    _albumSwipeStartHandler = (e) => {
        startX = e.touches[0].clientX;
    };
    _albumSwipeEndHandler = (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                navigateAlbum(1); // Swipe left - next
            } else {
                navigateAlbum(-1); // Swipe right - previous
            }
        }
    };
    
    container.addEventListener('touchstart', _albumSwipeStartHandler, { passive: true });
    container.addEventListener('touchend', _albumSwipeEndHandler);
}

function navigateAlbum(direction) {
    const memory = memories.find(m => m.id === currentViewingMemoryId);
    if (!memory) return;
    
    currentAlbumIndex += direction;
    
    if (currentAlbumIndex < 0) {
        currentAlbumIndex = memory.images.length - 1;
    } else if (currentAlbumIndex >= memory.images.length) {
        currentAlbumIndex = 0;
    }
    
    renderAlbumPhoto(memory);
    updatePhotoCounter(memory.images.length);
}

function updatePhotoCounter(total) {
    document.getElementById('photo-counter').textContent = `${currentAlbumIndex + 1} / ${total}`;
}

async function handleMemoryDelete() {
    if (!currentViewingMemoryId) return;
    if (!confirm('Delete this memory forever?')) return;
    
    showLoading(true);
    try {
        // Find the memory to get its Cloudinary assets before deleting from Firestore
        const memory = memories.find(m => m.id === currentViewingMemoryId);
        
        // Delete assets from Cloudinary (runs in parallel, non-blocking)
        if (memory) {
            deleteMemoryFromCloudinary(memory).catch(err =>
                console.warn('⚠️ Cloudinary cleanup error:', err)
            );
        }
        
        await memoriesCollection.doc(currentViewingMemoryId).delete();
        console.log('✅ Memory deleted');
        document.getElementById('album-viewer-modal').classList.add('hidden');
        document.getElementById('photo-viewer-modal').classList.add('hidden');
        currentViewingMemoryId = null;
        await loadMemories();
    } catch (error) {
        console.error('❌ Delete failed:', error);
        showError('Failed to delete memory');
    }
    showLoading(false);
}

function formatMemoryDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getImageStyle(memory) {
    const posX = memory.imagePosition ? memory.imagePosition.x : 50;
    const posY = memory.imagePosition ? memory.imagePosition.y : 50;
    const zoom = memory.imageZoom || 1;
    return `object-fit: cover; object-position: ${posX}% ${posY}%${zoom !== 1 ? `; transform: scale(${zoom})` : ''}`;
}

// Check if a media URL at given index is a video
function isVideoMedia(memory, index) {
    if (memory.mediaTypes && memory.mediaTypes[index]) {
        return memory.mediaTypes[index] === 'video';
    }
    // Fallback: check URL extension
    const url = (memory.images && memory.images[index]) || '';
    return /\.(mp4|mov|webm|m4v|avi)(\?|$)/i.test(url) || url.includes('/video/');
}

// Render media element (image or video) as HTML string
// When lazy is true, videos use preload="metadata" and don't autoplay (for timeline thumbnails)
function renderMediaElement(url, isVideo, altText, style, extraAttrs, lazy) {
    if (isVideo) {
        if (lazy) {
            return `<video src="${url}" 
                        muted loop playsinline preload="metadata"
                        ${extraAttrs || ''}
                        style="${style}; width: 100%; height: 100%; object-fit: cover;"></video>`;
        }
        return `<video src="${url}" 
                    autoplay muted loop playsinline preload="auto"
                    ${extraAttrs || ''}
                    style="${style}; width: 100%; height: 100%; object-fit: cover;"></video>`;
    }
    return `<img src="${url}" 
                alt="${altText}" 
                loading="lazy"
                ${extraAttrs || ''}
                style="${style}">`;
}

// IntersectionObserver to play/pause timeline videos based on visibility
let timelineVideoObserver = null;

function observeTimelineVideos() {
    // Disconnect previous observer if any
    if (timelineVideoObserver) {
        timelineVideoObserver.disconnect();
    }

    timelineVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play().catch(() => {
                    // Expected on some mobile browsers due to autoplay policies
                });
            } else {
                video.pause();
            }
        });
    }, { rootMargin: '200px' });

    const timeline = document.getElementById('memories-timeline');
    if (!timeline) return;
    const videos = timeline.querySelectorAll('video');
    videos.forEach(video => timelineVideoObserver.observe(video));
}

// Notes Handling
