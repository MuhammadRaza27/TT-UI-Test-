// Add click functionality to cards and layout items
document.querySelectorAll('.cursor-pointer').forEach(element => {
    element.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Handle different actions based on element
        if (this.querySelector('h3').textContent.includes('Create New Layout')) {
            // Open modal
            document.getElementById('createLayoutModal').classList.remove('hidden');
        } else if (this.querySelector('h3').textContent.includes('Load Saved Layout')) {
            console.log('Loading saved layout...');
            // Add your load layout logic here
        } else {
            const layoutName = this.querySelector('h3').textContent;
            console.log(`Loading layout: ${layoutName}`);
            // Add your load specific layout logic here
        }
    });
});

// Modal functionality
const modal = document.getElementById('createLayoutModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const createBtn = document.getElementById('createBtn');
const layoutNameInput = document.getElementById('layoutName');

// Close modal functions
function closeModalFunction() {
    modal.classList.add('hidden');
    // Reset form
    layoutNameInput.value = '';
    resetAllTools();
    updateCreateButton();
    
    // Reset button text to original
    createBtn.textContent = 'Create Layout';
}

closeModal.addEventListener('click', closeModalFunction);
cancelBtn.addEventListener('click', closeModalFunction);

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModalFunction();
    }
});

// Tool selection functionality
function toggleTool(toolItem) {
    const isAdded = toolItem.getAttribute('data-added') === 'true';
    const button = toolItem.querySelector('.tool-btn');
    
    if (isAdded) {
        // Remove tool
        toolItem.setAttribute('data-added', 'false');
        toolItem.classList.remove('bg-primary', 'border-primary');
        toolItem.classList.add('bg-[#161725]');
        button.innerHTML = `
            <svg class="w-14 h-14 text-white" fill="none" stroke="#444CE7" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        `;
        button.classList.remove('bg-[#444CE7]');
    } else {
        // Add tool
        toolItem.setAttribute('data-added', 'true');
        toolItem.classList.remove('bg-[#161725]');
        toolItem.classList.add('bg-primary', 'border-primary');
        button.innerHTML = `
            <svg class="w-14 h-14 text-white" fill="none" stroke="white" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h12"></path>
            </svg>
        `;
        button.classList.add('bg-[#444CE7]');
    }
    
    updateCreateButton();
}

// Add tool click listeners
document.addEventListener('click', function(e) {
    if (e.target.closest('.tool-btn') || e.target.closest('.tool-item')) {
        e.preventDefault();
        const toolItem = e.target.closest('.tool-item');
        // Check if we're in Create Layout modal
        if (createLayoutModal && !createLayoutModal.classList.contains('hidden')) {
            toggleTool(toolItem);
        }
    }
});

// Reset all tools to unselected state
function resetAllTools() {
    document.querySelectorAll('.tool-item').forEach(tool => {
        tool.setAttribute('data-added', 'false');
        tool.classList.remove('bg-primary', 'border-primary');
        tool.classList.add('bg-[#161725]');
        const button = tool.querySelector('.tool-btn');
        button.innerHTML = `
            <svg class="w-14 h-14 text-white" fill="none" stroke="#444CE7" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        `;
        button.classList.remove('bg-[#444CE7]');
    });
}

// Update create button state
function updateCreateButton() {
    const hasName = layoutNameInput.value.trim().length > 0;
    const hasSelectedTools = document.querySelectorAll('.tool-item[data-added="true"]').length > 0;
    
    if (hasName && hasSelectedTools) {
        createBtn.disabled = false;
        createBtn.classList.remove('bg-gray-600');
        createBtn.classList.add('bg-[#3538CD]');
    } else {
        createBtn.disabled = true;
        createBtn.classList.remove('bg-[#3538CD]');
        createBtn.classList.add('bg-gray-600');
    }
}

// Listen for layout name input changes
layoutNameInput.addEventListener('input', updateCreateButton);

// Create layout button functionality
createBtn.addEventListener('click', function() {
    if (!this.disabled) {
        const layoutName = layoutNameInput.value.trim();
        const selectedTools = Array.from(document.querySelectorAll('.tool-item[data-added="true"]'))
            .map(tool => tool.getAttribute('data-tool'));
        
        console.log('Creating layout:', layoutName);
        console.log('Selected tools:', selectedTools);
        
        // Check if this is Update Layout mode
        if (this.textContent === 'Update Layout') {
            // Close current modal and show save confirmation
            closeModalFunction();
            
            // Update the confirmation modal text
            const saveModal = document.getElementById('saveLayoutModal');
            const confirmText = saveModal.querySelector('p');
            if (confirmText) {
                confirmText.textContent = `Are you sure you want to save '${layoutName}'?`;
            }
            
            // Show save confirmation modal
            saveModal.classList.remove('hidden');
        } else {
            // Original Create Layout behavior
            closeModalFunction();
            
            // Open Add Layout modal
            document.getElementById('addLayoutModal').classList.remove('hidden');
        }
        
        // Add your layout creation logic here
    }
});

// Load Saved Layout Card functionality
const loadSavedLayoutCard = document.getElementById('loadSavedLayoutCard');
if (loadSavedLayoutCard) {
    loadSavedLayoutCard.addEventListener('click', function() {
        // Open Load Saved Layouts modal
        document.getElementById('loadLayoutModal').classList.remove('hidden');
        loadSavedLayouts();
    });
}

// Load Saved Layouts Modal functionality
const loadLayoutModal = document.getElementById('loadLayoutModal');
const closeLoadModal = document.getElementById('closeLoadModal');
const layoutSearchInput = document.getElementById('layoutSearchInput');
const layoutsList = document.getElementById('layoutsList');

// Delete Confirmation Modal functionality
const deleteConfirmModal = document.getElementById('deleteConfirmModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

let layoutToDelete = null;

function loadSavedLayouts() {
    // Clear existing layouts
    layoutsList.innerHTML = '';
    
    // Get saved layouts from localStorage
    const savedLayouts = JSON.parse(localStorage.getItem('savedLayouts') || '[]');
    
    // Create layout items
    savedLayouts.forEach((layout, index) => {
        const layoutItem = document.createElement('div');
        layoutItem.className = 'layout-item p-3 rounded-lg cursor-pointer hover:bg-[#4A4A4A] transition-colors flex items-center justify-between';
        layoutItem.innerHTML = `
            <span class="text-[#C0CBE1] text-[16px]">${layout.name}</span>
            <button class="delete-layout-btn text-white hover:text-gray-300 p-1 rounded hover:bg-red-900/20 transition-all duration-200" style="opacity: 0;">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        `;
        
        // Add hover functionality for delete button
        const deleteBtn = layoutItem.querySelector('.delete-layout-btn');
        layoutItem.addEventListener('mouseenter', () => {
            deleteBtn.style.opacity = '1';
        });
        layoutItem.addEventListener('mouseleave', () => {
            deleteBtn.style.opacity = '0';
        });
        
        // Add click functionality to load layout
        layoutItem.addEventListener('click', function(e) {
            // Don't trigger if delete button is clicked
            if (e.target.closest('.delete-layout-btn')) {
                return;
            }
            console.log(`Loading layout: ${layout.name}`);
            closeLoadModalFunc();
        });
        
        // Add delete functionality
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent layout item click
            
            // Store layout to delete and show confirmation modal
            layoutToDelete = { layout, index };
            deleteConfirmModal.classList.remove('hidden');
        });
        
        layoutsList.appendChild(layoutItem);
    });
}

function closeLoadModalFunc() {
    loadLayoutModal.classList.add('hidden');
}

// Search functionality
if (layoutSearchInput) {
    layoutSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const layoutItems = layoutsList.querySelectorAll('.layout-item');
        
        layoutItems.forEach(item => {
            const layoutName = item.querySelector('span').textContent.toLowerCase();
            if (layoutName.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Delete confirmation modal functions
function closeDeleteModalFunc() {
    deleteConfirmModal.classList.add('hidden');
    layoutToDelete = null;
}

function confirmDelete() {
    if (layoutToDelete) {
        const savedLayouts = JSON.parse(localStorage.getItem('savedLayouts') || '[]');
        const updatedLayouts = savedLayouts.filter((_, i) => i !== layoutToDelete.index);
        localStorage.setItem('savedLayouts', JSON.stringify(updatedLayouts));
        
        // Refresh the layouts list
        loadSavedLayouts();
        
        console.log(`Deleted layout: ${layoutToDelete.layout.name}`);
        
        // Show toast notification for successful deletion BEFORE closing modal
        showDeleteToast();
        
        // Close modal after showing toast
        closeDeleteModalFunc();
    }
}

// Event listeners for Load Layout modal
if (closeLoadModal) {
    closeLoadModal.addEventListener('click', closeLoadModalFunc);
}

// Close modal when clicking outside
if (loadLayoutModal) {
    loadLayoutModal.addEventListener('click', function(e) {
        if (e.target === loadLayoutModal) {
            closeLoadModalFunc();
        }
    });
}

// Event listeners for Delete Confirmation modal
if (closeDeleteModal) {
    closeDeleteModal.addEventListener('click', closeDeleteModalFunc);
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', closeDeleteModalFunc);
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', confirmDelete);
}

// Close delete modal when clicking outside
if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener('click', function(e) {
        if (e.target === deleteConfirmModal) {
            closeDeleteModalFunc();
        }
    });
}

// Add Layout Modal functionality
const addLayoutModal = document.getElementById('addLayoutModal');
const closeAddLayoutModal = document.getElementById('closeAddLayoutModal');
const cancelAddLayoutBtn = document.getElementById('cancelAddLayoutBtn');
const addLayoutBtn = document.getElementById('addLayoutBtn');

// Close Add Layout modal functions
function closeAddLayoutModalFunction() {
    addLayoutModal.classList.add('hidden');
    // Reset tools in Add Layout modal
    resetAllAddLayoutTools();
}

closeAddLayoutModal.addEventListener('click', closeAddLayoutModalFunction);
cancelAddLayoutBtn.addEventListener('click', closeAddLayoutModalFunction);

// Close Add Layout modal when clicking outside
addLayoutModal.addEventListener('click', function(e) {
    if (e.target === addLayoutModal) {
        closeAddLayoutModalFunction();
    }
});

// Add Layout tool selection functionality
function toggleAddLayoutTool(toolItem) {
    const isAdded = toolItem.getAttribute('data-added') === 'true';
    const button = toolItem.querySelector('.tool-btn');
    const iconSvg = toolItem.querySelector('.tool-icon svg');
    const labelSpan = toolItem.querySelector('.tool-label');
    
    if (isAdded) {
        // Remove tool
        toolItem.setAttribute('data-added', 'false');
        toolItem.classList.remove('bg-primary', 'border-primary');
        toolItem.classList.remove('border-[#3538CD]', 'border-2');
        toolItem.classList.add('bg-[#161725]');
        button.innerHTML = `
            <svg class="w-14 h-14 text-white" fill="none" stroke="#444CE7" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        `;
        button.classList.remove('bg-[#444CE7]');
        
        // Reset icon stroke color
        if (iconSvg) {
            iconSvg.setAttribute('stroke', '#636E85');
            iconSvg.setAttribute('fill', '#636E85');
        }
        
        // Reset label color
        if (labelSpan) {
            labelSpan.classList.remove('text-[#191D40]');
            labelSpan.classList.add('text-white');
        }
    } else {
        // Add tool
        toolItem.setAttribute('data-added', 'true');
        toolItem.classList.remove('bg-[#161725]');
        toolItem.classList.add('bg-primary', 'border-primary');
        toolItem.classList.add('border-[#3538CD]', 'border-2');
        button.innerHTML = `
            <svg class="w-14 h-14 text-white" fill="none" stroke="white" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 12h12"></path>
            </svg>
        `;
        button.classList.add('bg-[#444CE7]');
        
        // Change icon stroke color to blue
        if (iconSvg) {
            iconSvg.setAttribute('stroke', '#444CE7');
            iconSvg.setAttribute('fill', '#444CE7');
        }
        
        // Change label color
        if (labelSpan) {
            labelSpan.classList.remove('text-white');
            labelSpan.classList.add('text-[#191D40]');
        }
    }
}

// Add tool click listeners for Add Layout modal
document.addEventListener('click', function(e) {
    if (e.target.closest('.tool-btn') || e.target.closest('.tool-item')) {
        e.preventDefault();
        const toolItem = e.target.closest('.tool-item');
        // Check if we're in Add Layout modal
        if (addLayoutModal && !addLayoutModal.classList.contains('hidden')) {
            toggleAddLayoutTool(toolItem);
        }
    }
});

// Reset all tools in Add Layout modal to unselected state
function resetAllAddLayoutTools() {
    document.querySelectorAll('.tool-item').forEach(tool => {
        tool.setAttribute('data-added', 'false');
        tool.classList.remove('bg-primary', 'border-primary');
        tool.classList.remove('border-[#3538CD]', 'border-2');
        tool.classList.add('bg-[#161725]');
        const button = tool.querySelector('.tool-btn');
        const iconSvg = tool.querySelector('.tool-icon svg');
        const labelSpan = tool.querySelector('.tool-label');
        
        button.innerHTML = `
            <svg class="w-14 h-14 text-white" fill="none" stroke="#444CE7" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
        `;
        button.classList.remove('bg-[#444CE7]');
        
        // Reset icon stroke color
        if (iconSvg) {
            iconSvg.setAttribute('stroke', '#636E85');
            iconSvg.setAttribute('fill', '#636E85');
        }
        
        // Reset label color
        if (labelSpan) {
            labelSpan.classList.remove('text-[#191D40]');
            labelSpan.classList.add('text-white');
        }
    });
}

// Add Layout button functionality
addLayoutBtn.addEventListener('click', function() {
    const selectedTools = Array.from(document.querySelectorAll('.tool-item[data-added="true"]'))
        .map(tool => tool.getAttribute('data-tool'));
    
    console.log('Adding layout with tools:', selectedTools);
    
    // Save the layout
    saveLayout(selectedTools);
    
    // Close Add Layout modal
    closeAddLayoutModalFunction();
});

// Layout storage functionality
// Clear existing localStorage and set default layouts
localStorage.removeItem('savedLayouts');
let savedLayouts = [
    {
        id: 1,
        name: "My First Layout",
        tools: ["bar-chart", "most-active-tickers", "events", "pie-chart", "line-chart"],
        toolCount: 5,
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "My Custom Layout",
        tools: ["most-active-tickers", "events", "x-twitter", "area-chart"],
        toolCount: 4,
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "My Favorite Layout",
        tools: ["bar-chart", "most-active-tickers", "events", "pie-chart", "line-chart", "candlestick-chart"],
        toolCount: 6,
        createdAt: new Date().toISOString()
    }
];
localStorage.setItem('savedLayouts', JSON.stringify(savedLayouts));

function saveLayout(tools) {
    const layoutName = prompt('Enter layout name:');
    if (layoutName && tools.length > 0) {
        const layout = {
            id: Date.now(),
            name: layoutName,
            tools: tools,
            toolCount: tools.length,
            createdAt: new Date().toISOString()
        };
        
        savedLayouts.unshift(layout); // Add to beginning
        
        // Keep only last 10 layouts
        if (savedLayouts.length > 10) {
            savedLayouts = savedLayouts.slice(0, 10);
        }
        
        localStorage.setItem('savedLayouts', JSON.stringify(savedLayouts));
        displaySavedLayouts();
    }
}

function displaySavedLayouts() {
    const savedLayoutsSection = document.getElementById('savedLayoutsSection');
    const savedLayoutsList = document.getElementById('savedLayoutsList');
    savedLayoutsList.innerHTML = '';
    
    if (savedLayouts.length === 0) {
        // Hide the entire section when no layouts exist
        savedLayoutsSection.classList.add('hidden');
        return;
    }
    
    // Show the section when layouts exist
    savedLayoutsSection.classList.remove('hidden');
    
    // Only show the last 3 saved layouts
    const lastThree = savedLayouts.slice(0, 3);
    lastThree.forEach(layout => {
        const layoutElement = document.createElement('div');
        layoutElement.className = 'flex items-between justify-between bg-[#161725] rounded-lg p-6 cursor-pointer hover:bg-[#1A1A1A] transition-colors group border border-[#2A2A2A] max-h-[40px] w-[500px] mx-auto';
        layoutElement.innerHTML = `
            <div class="flex items-center ">
                <span class="text-[#A1ACC2] text-[18px] font-medium">${layout.name}</span>
            </div>
            <div class="flex items-center space-x-3">
                <span class="text-[#636E85] text-sm">${layout.toolCount} tools</span>
                <svg class="w-6 h-6 text-[#636E85] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
            </div>
        `;
        
        // Click functionality removed - only CSS styling remains
        
        savedLayoutsList.appendChild(layoutElement);
    });
}

function loadLayout(layout) {
    console.log('Loading layout:', layout);
    // You can add more logic here to actually load the layout
    alert(`Loading layout: ${layout.name} with ${layout.toolCount} tools`);
}

// Initialize saved layouts display when page loads
document.addEventListener('DOMContentLoaded', function() {
    displaySavedLayouts();
    
    // Button click functionality for Current Layout buttons
    const saveLayoutBtn = document.getElementById('saveLayoutBtn');
    const editLayoutBtn = document.getElementById('editLayoutBtn');
    const closeLayoutBtn = document.getElementById('closeLayoutBtn');
    
    if (saveLayoutBtn) {
        saveLayoutBtn.addEventListener('click', function() {
            this.style.backgroundColor = '#444CE7';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
            
            // Show confirmation modal
            document.getElementById('saveLayoutModal').classList.remove('hidden');
        });
    }
    
    if (editLayoutBtn) {
        editLayoutBtn.addEventListener('click', function() {
            this.style.backgroundColor = '#444CE7';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
            
            // Open Create Layout Modal and change button text
            const createLayoutModal = document.getElementById('createLayoutModal');
            const createBtn = document.getElementById('createBtn');
            
            if (createLayoutModal) {
                createLayoutModal.classList.remove('hidden');
            }
            
            if (createBtn) {
                createBtn.textContent = 'Update Layout';
            }
            
            // Pre-fill the input field with current layout name
            if (layoutNameInput) {
                layoutNameInput.value = 'My Most Used Layout';
            }
        });
    }
    
    if (closeLayoutBtn) {
        closeLayoutBtn.addEventListener('click', function() {
            this.style.backgroundColor = '#444CE7';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 200);
            
            // Show unsaved changes confirmation modal
            document.getElementById('unsavedChangesModal').classList.remove('hidden');
        });
    }
});

// Unsaved Changes Modal functionality
const unsavedChangesModal = document.getElementById('unsavedChangesModal');
const closeUnsavedModal = document.getElementById('closeUnsavedModal');
const discardChangesBtn = document.getElementById('discardChangesBtn');
const saveBeforeCloseBtn = document.getElementById('saveBeforeCloseBtn');

// Close unsaved modal functions
function closeUnsavedModalFunc() {
    unsavedChangesModal.classList.add('hidden');
}

// Event listeners for unsaved modal
if (closeUnsavedModal) {
    closeUnsavedModal.addEventListener('click', closeUnsavedModalFunc);
}

if (discardChangesBtn) {
    discardChangesBtn.addEventListener('click', function() {
        // Discard changes and close
        console.log('Changes discarded!');
        closeUnsavedModalFunc();
        // Here you can add logic to actually discard changes
    });
}

if (saveBeforeCloseBtn) {
    saveBeforeCloseBtn.addEventListener('click', function() {
        // Save and close
        console.log('Layout saved before closing!');
        closeUnsavedModalFunc();
        showToast();
    });
}

// Close unsaved modal when clicking outside
if (unsavedChangesModal) {
    unsavedChangesModal.addEventListener('click', function(e) {
        if (e.target === unsavedChangesModal) {
            closeUnsavedModalFunc();
        }
    });
}

// Save Layout Modal functionality
const saveLayoutModal = document.getElementById('saveLayoutModal');
const closeSaveModal = document.getElementById('closeSaveModal');
const cancelSaveBtn = document.getElementById('cancelSaveBtn');
const confirmSaveBtn = document.getElementById('confirmSaveBtn');

// Close modal functions
function closeSaveModalFunc() {
    saveLayoutModal.classList.add('hidden');
}

// Event listeners for modal
if (closeSaveModal) {
    closeSaveModal.addEventListener('click', closeSaveModalFunc);
}

if (cancelSaveBtn) {
    cancelSaveBtn.addEventListener('click', closeSaveModalFunc);
}

if (confirmSaveBtn) {
    confirmSaveBtn.addEventListener('click', function() {
        // Here you can add the actual save functionality
        console.log('Layout saved!');
        closeSaveModalFunc();
        
        // Show toast notification
        showToast();
    });
}

// Close modal when clicking outside
if (saveLayoutModal) {
    saveLayoutModal.addEventListener('click', function(e) {
        if (e.target === saveLayoutModal) {
            closeSaveModalFunc();
        }
    });
}

// Toast Notification functionality
const toastNotification = document.getElementById('toastNotification');
const closeToast = document.getElementById('closeToast');
const toastProgress = document.getElementById('toastProgress');

function showToast() {
    // Reset toast content for save
    const toastTitle = toastNotification.querySelector('h4');
    const toastMessage = toastNotification.querySelector('p');
    
    if (toastTitle && toastMessage) {
        toastTitle.textContent = 'Layout Saved!';
        toastMessage.textContent = '"My Most Used Layout" has been saved.';
    }
    
    // Show toast and slide in from right
    toastNotification.classList.remove('hidden');
    toastNotification.classList.remove('translate-x-full');
    toastNotification.classList.add('translate-x-0');
    
    // Reset progress bar to 0%
    toastProgress.style.width = '0%';
    
    // Animate progress bar from 0% to 100%
    setTimeout(() => {
        toastProgress.style.width = '100%';
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    // Slide out to the right
    toastNotification.classList.remove('translate-x-0');
    toastNotification.classList.add('translate-x-full');
    
    // Hide after animation completes
    setTimeout(() => {
        toastNotification.classList.add('hidden');
    }, 300);
}

// Delete toast notification function
function showDeleteToast() {
    // Update toast content for deletion
    const toastTitle = toastNotification.querySelector('h4');
    const toastMessage = toastNotification.querySelector('p');
    
    if (toastTitle && toastMessage) {
        toastTitle.textContent = 'Layout Deleted!';
        const layoutName = layoutToDelete ? layoutToDelete.layout.name : 'Layout';
        toastMessage.textContent = `"${layoutName}  "  has been deleted  .`;
        console.log('Toast showing for layout:', layoutName); // Debug log
    }
    
    // Show toast and slide in from right
    toastNotification.classList.remove('hidden');
    toastNotification.classList.remove('translate-x-full');
    toastNotification.classList.add('translate-x-0');
    
    // Reset progress bar to 0%
    toastProgress.style.width = '0%';
    
    // Animate progress bar from 0% to 100%
    setTimeout(() => {
        toastProgress.style.width = '100%';
    }, 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideToast();
    }, 3000);
}

// Close toast button
if (closeToast) {
    closeToast.addEventListener('click', hideToast);
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const focused = document.activeElement;
        if (focused && focused.classList.contains('cursor-pointer')) {
            focused.click();
        }
    }
    
    // Close modal with Escape key
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModalFunction();
    }
    
    // Close Add Layout modal with Escape key
    if (e.key === 'Escape' && addLayoutModal && !addLayoutModal.classList.contains('hidden')) {
        closeAddLayoutModalFunction();
    }
});