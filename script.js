document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded");
    
    // Mobile detector
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const container = document.querySelector('.container');
    const mobileContainer = document.querySelector('.mobile-container');
    
    if (isMobile) {
        container.style.display = 'none';
        mobileContainer.style.display = 'flex';
    } else {
        container.style.display = 'flex';
        mobileContainer.style.display = 'none';
    }
    
    // overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);
    
    // Close by clicking outside
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Create item element 
    function createItemElement(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.dataset.id = item.id;
        itemElement.dataset.name = item.name;
        itemElement.dataset.author = item.author;
        itemElement.dataset.year = item.year;
        itemElement.dataset.description = item.description;
        itemElement.dataset.imageUrl = item.imageUrl;
        
        // Set background if image exists
        if (item.imageUrl) {
            itemElement.style.backgroundImage = `url(${item.imageUrl})`;
            itemElement.style.backgroundSize = 'cover';
            itemElement.style.backgroundPosition = 'center';
        }
        
        // Title element
        const titleElement = document.createElement('div');
        titleElement.className = 'item-title';
        titleElement.textContent = item.name;
        titleElement.style.display = 'none';
        itemElement.appendChild(titleElement);
        
        return itemElement;
    }
    
    function attachItemEvents(itemElement) {
        const titleElement = itemElement.querySelector('.item-title');
        
        // hover
        itemElement.addEventListener('mouseover', function() {
            if (titleElement) titleElement.style.display = 'block';
        });
        
        // title
        itemElement.addEventListener('mouseout', function() {
            if (titleElement) titleElement.style.display = 'none';
        });
        
        // Click
        itemElement.addEventListener('click', function(e) {
            console.log("Item clicked", itemElement.dataset.name);
            e.stopPropagation();
            
            if (overlay.style.display === 'flex') {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                return;
            }
            
        // popup
            overlay.innerHTML = `
                <div class="popup" onclick="event.stopPropagation();">
                    <div class="popup-content">
                        <div class="popup-image">
                            ${itemElement.dataset.imageUrl ? `<img src="${itemElement.dataset.imageUrl}" alt="${itemElement.dataset.name}">` : '<div class="no-image"></div>'}
                        </div>
                        <div class="popup-info">
                            <h2>${itemElement.dataset.name}</h2>
                            ${itemElement.dataset.author ? `<p class="popup-author">${itemElement.dataset.author}</p>` : ''}
                            <p class="popup-year">${itemElement.dataset.year}</p>
                            <p class="popup-description">${itemElement.dataset.description}</p>
                        </div>
                    </div>
                </div>
            `;
            
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    //data from sheets
    async function fetchItemsFromGoogleSheets() {
        try {
            const API_KEY = 'AIzaSyB4bWi7loozev1cqSny2LPr3URhATkV-6k';
            const SHEET_ID = '1YKMyNhvMoLz4bmmtQSeQLqKuPOtU0rCuaDlANdGZ1wA';
            const RANGE = 'Sheet1!A1:E40';
            
            console.log("Fetching data...");
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to get data: ' + response.statusText);
            }
            
            const data = await response.json();
            console.log("Data fetched");
            
            if (!data.values || data.values.length <= 1) {
                console.error("No data found");
                return [];
            }
            
            const headers = data.values[0];
            
            const items = data.values.slice(1).map((row, index) => {
                return {
                    id: index + 1,
                    name: row[0] || 'Untitled',
                    author: row[1] || '',
                    year: row[2] || '',
                    description: row[3] || '',
                    imageUrl: row[4] || ''
                };
            });
            
            return items;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
    
    
    
    // Init page
    async function initPage() {
        console.log("Initializing...");
        const items = await fetchItemsFromGoogleSheets();
        
        if (items.length === 0) {
            console.error('No items found, using test data');
            testWithSampleData();
            return;
        }
        
        distributeItems(items);
    }
    
    // Create test data
    function testWithSampleData() {
        const items = [];
        for (let i = 1; i <= 39; i++) {
            items.push({
                id: i,
                name: `Item${i}`,
                author: `Author${i}`,
                year: `${2000 + Math.floor(Math.random() * 23)}`,
                description: `This is description for item ${i}.`
            });
        }
        
        distributeItems(items);
    }
    
    // Distribute items to sections
    function distributeItems(items) {
        console.log("Distributing items");
        
        const column1 = document.getElementById('column-1');
        const column2 = document.getElementById('column-2');
        const column3 = document.getElementById('column-3');
        const rightTop = document.getElementById('right-top');
        const rightMiddle = document.getElementById('right-middle');
        
        const mobileUpperMiddle = document.getElementById('mobile-upper-middle');
        const mobileMiddle = document.getElementById('mobile-middle');
        const mobileLowerMiddle = document.getElementById('mobile-lower-middle');
        const mobileBottomRight = document.getElementById('mobile-bottom-right');
        
        if (column1) column1.innerHTML = '';
        if (column2) column2.innerHTML = '';
        if (column3) column3.innerHTML = '';
        if (rightTop) rightTop.innerHTML = '';
        if (rightMiddle) rightMiddle.innerHTML = '';
        if (mobileUpperMiddle) mobileUpperMiddle.innerHTML = '';
        if (mobileMiddle) mobileMiddle.innerHTML = '';
        if (mobileLowerMiddle) mobileLowerMiddle.innerHTML = '';
        if (mobileBottomRight) mobileBottomRight.innerHTML = '';
        
        // Left 9 + 10 + 9
        for (let i = 0; i < 9; i++) {
            if (column1 && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                column1.appendChild(item);
            }
        }
        
        for (let i = 9; i < 19; i++) {
            if (column2 && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                column2.appendChild(item);
            }
        }
        
        for (let i = 19; i < 28; i++) {
            if (column3 && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                column3.appendChild(item);
            }
        }
        
        // Right 6 + 5
        for (let i = 28; i < 34; i++) {
            if (rightTop && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                rightTop.appendChild(item);
            }
        }
        
        for (let i = 34; i < 39; i++) {
            if (rightMiddle && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                rightMiddle.appendChild(item);
            }
        }
        
        // Mobile layout
        let itemCount = Math.min(items.length, 39);
        let itemsPerSection = Math.ceil(itemCount / 4);
        
        for (let i = 0; i < itemsPerSection; i++) {
            if (mobileUpperMiddle && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                mobileUpperMiddle.appendChild(item);
            }
        }
        
        for (let i = itemsPerSection; i < 2 * itemsPerSection; i++) {
            if (mobileMiddle && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                mobileMiddle.appendChild(item);
            }
        }
        
        for (let i = 2 * itemsPerSection; i < 3 * itemsPerSection; i++) {
            if (mobileLowerMiddle && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                mobileLowerMiddle.appendChild(item);
            }
        }
        
        for (let i = 3 * itemsPerSection; i < 4 * itemsPerSection; i++) {
            if (mobileBottomRight && i < items.length) {
                const item = createItemElement(items[i]);
                attachItemEvents(item);
                mobileBottomRight.appendChild(item);
            }
        }
    }
    
    initPage();
});