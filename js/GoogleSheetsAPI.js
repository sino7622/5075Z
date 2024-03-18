// const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';

// 經濟部技術處產業技術白皮書清單
$(document).ready(function () {
    // API金鑰
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';

    // Google Sheets的ID
    const sheetId = '1vTpVgSJCEMKzIunvOxxo077xyYcDnO-2DrDHFybKLMM';

    // 取得所有分頁的名稱
    const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}`;
    $.get(sheetApiUrl, function (sheetData) {
        const sheets = sheetData.sheets;

        // 新增全選複選框
        const selectAllCheckboxHtml = '<label><input type="checkbox" id="select-all-checkbox" checked>全選</label>';
        $('#filter-options').append(selectAllCheckboxHtml);

        // 新增複選框
        const filterOptions = $('#filter-options');
        sheets.forEach(function (sheet) {
            const sheetName = sheet.properties.title;
            const checkboxHtml = `<label><input type="checkbox" class="filter-checkbox m-2" value="${sheetName}" checked>${sheetName}</label>`;

            filterOptions.append(checkboxHtml);
        });

        // 新增顯示篩選筆數的元素
        const filterInfo = $('#filter-info');
        filterInfo.append('<p id="filtered-count" class="text-end">篩選筆數： 0</p>');

        // 初始化表格函數
        function initTable() {
            // 新增表格
            const dataTable = $('#research-table tbody');

            // 更新表格函數
            function updateTable() {
                // 清空表格
                dataTable.empty();

                // 取得所有被選擇的分頁
                const selectedSheets = $('.filter-checkbox:checked').map(function () {
                    return $(this).val();
                }).get();

                let filteredCount = 0;

                // 存儲已經添加的資料
                const addedRows = {};

                // 迭代每個選擇的分頁
                selectedSheets.forEach(function (selectedSheet) {
                    const sheetData = allData.find(data => data.sheetName === selectedSheet);

                    if (sheetData) {
                        const values = sheetData.values;

                        // 取得文字篩選條件
                        const filterValue = $('#filter-input').val().toLowerCase();

                        // 將資料添加到HTML表格中
                        values.forEach(function (row) {
                            // 如果文字篩選條件為空，或資料中的C、E、F欄位任一包含文字篩選條件，則顯示該資料
                            if (
                                filterValue === '' ||
                                row[2].toLowerCase().includes(filterValue) ||
                                row[4].toLowerCase().includes(filterValue) ||
                                row[5].toLowerCase().includes(filterValue)
                            ) {
                                const key = row.join(); // 使用資料的內容作為唯一鍵
                            
                                if (!addedRows[key]) {
                                    addedRows[key] = true;
                                    filteredCount++;
                                
                                    const teamItemHtml = `
                                        <tr>
                                            <td>${row[0]}</td>
                                            <td>${row[2]}</td>
                                            <td>${row[3]}</td>
                                            <td>${row[4]}</td>
                                            <td>${row[5]}</td>
                                            <td><a target="_blank" href='${row[7]}'><i class="fab bi bi-download"></i> </a></td>
                                        </tr>
                                    `;
                                
                                    dataTable.append(teamItemHtml);
                                }
                            }
                        });
                    }
                });

                // 更新篩選筆數
                $('#filtered-count').text(`篩選筆數: ${filteredCount}`);
            }

            // 初始化表格
            updateTable();

            // 監聽複選框變化
            $('.filter-checkbox').change(updateTable);

            // 全選/取消全選
            $('#select-all-checkbox').change(function () {
                const isChecked = $(this).prop('checked');
                $('.filter-checkbox').prop('checked', isChecked);
                $('#filtered-count').text(`篩選筆數: 0`);
                updateTable();
            });

            // 監聽文字輸入框變化
            $('#filter-input').on('input', updateTable);
        }

        // 收集所有分頁資料的陣列
        const allData = [];

        // 迭代每個分頁，取得資料
        sheets.forEach(function (sheet) {
            const sheetName = sheet.properties.title;
            const range = `${sheetName}!A2:H80`;
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

            $.get(apiUrl, function (data) {
                const values = data.values;
                allData.push({ sheetName, values });

                // 如果已經收集完所有分頁資料，則進行排序並初始化表格
                if (allData.length === sheets.length) {
                    allData.sort((a, b) => b.sheetName.localeCompare(a.sheetName)); // 由大到小排序

                    // 初始化表格
                    initTable();
                }
            });
        });
    });
});

// 國土計畫(縣市)
$(document).ready(function () {
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';
    const sheetId = '1NhsY9wH0S2pXpuVU6Y9LDG1lC_3zFBaNXmxWiwWOyas';
    const range = '表格清單!A2:E21';
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    $.get(apiUrl, function (data) {
        const values = data.values;
        const dataTable = $('#land-table tbody');
        values.forEach(function (row) {
            const tableRow = '<tr>' + row.map(col => `<td>${col}</td>`).join('') + '</tr>';
            dataTable.append(tableRow);
            const teamItemHtml = `
            
                <div class="col-lg-6 col-md-6 wow fadeInUp " data-wow-delay="0.1s">
                    <div class="team-item bg-light rounded">
                        <div class="text-center border-bottom p-4">
                            <img class="img-fluid rounded-circle mb-4" src="" alt="">
                            <h4>${row[1]}</h4>
                            <span>${row[0]}</span>
                        </div>
                        <div class="d-flex justify-content-center p-4">
                            <a class="btn mx-1" target="_blank" href="${row[2]}">
                                <i class="fab bi bi-globe"></i> 網站
                            </a>
                            <a class="btn mx-1" target="_blank" href="${row[3]}"><i class="fab bi bi-download"></i> 計畫書</a>
                            <a class="btn mx-1" target="_blank" href="${row[4]}"><i class="fab bi bi-download"></i>
                                技術報告</a>
                        </div>
                    </div>
                </div>
            
            `;
            $('#report_land').append(teamItemHtml);
        });
    });
});

// 都市計畫查詢系統
$(document).ready(function () {
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';
    const sheetId = '1KugYhhBw7lKDimouh0JT51g4XSjcrGig5Jf_bcQP3JQ';
    const range = 'UPweb!A2:E26';
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    $.get(apiUrl, function (data) {
        const values = data.values;
        const dataTable = $('#up-table tbody');
        values.forEach(function (row) {
            const tableRow = '<tr>' + row.map(col => `<td>${col}</td>`).join('') + '</tr>';
            dataTable.append(tableRow);
            const teamItemHtml = `
            
                <div class="col-lg-6 col-md-6 wow fadeInUp " data-wow-delay="0.1s">
                    <div class="team-item bg-light rounded">
                        <div class="text-center border-bottom p-4">
                            <img class="img-fluid rounded-circle mb-4" src="" alt="">
                            <h4><span class="badge bg-primary">${row[0]}</span></h4>
                            <h4>${row[1]}</h4>
                            <span>${row[2]}</span>
                        </div>
                        <div class="d-flex justify-content-center p-4">
                            <a class="btn mx-1" target="_blank" href="${row[3]}">
                                <i class="fab bi bi-globe"></i> 網站
                            </a>
                        </div>
                    </div>
                </div>
            
            `;
            $('#report_up').append(teamItemHtml);
        });
    });
});

//最新消息
$(document).ready(function () {
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';
    const sheetId = '1pRS2CjAbqOb8WPPPhNsPJs94y-70LyA6fmkpe_SgWiA';
    const range = '表單回應 1!A2:E6';
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    $.get(apiUrl, function (data) {
        const values = data.values;
      
        const carouselInner = $('#newsCarousel .carousel-inner');
        values.forEach(function (row, index) {
            const activeClass = index === 0 ? 'active' : '';
            const teamItemHtml = `
                <div class="row carousel-item ${activeClass}">

                        <div class="col-lg-12">
                            <div class="feature-item bg-light rounded text-center p-4">
                                <i class="fa ${row[4]} fa-3x text-primary mb-4"></i>
                                <h3 class="mb-3">${row[2]}</h3>
                                <p class="m-0 fs-5">${row[3]}</p>
                                <span class="badge rounded-pill bg-primary text-white mt-3">${row[0]}，發布人：${row[1]}</span>

                            </div>
                        </div>
                </div>
            `;
            
            carouselInner.append(teamItemHtml);
        });
      
        // 啟動 Bootstrap 5 輪播
        $('#newsCarousel').carousel();
      });

    
});

//產業鏈清單
$(document).ready(function () {
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';
    const sheetId = '1fOub1yuYBMmABDRcWJm4PnRiYjXyw2-fxGt7sqilvQ4';
    // Fetch data for chain items
    const chainRange = 'chain!A2:J86';
    const chainApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${chainRange}?key=${apiKey}`;

    // Fetch data for filter items
    const filterRange = 'type!A2:B20';
    const filterApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${filterRange}?key=${apiKey}`;


    // Fetch data from Google Sheets
    $.get(chainApiUrl, function (data) {
        const values = data.values;

        const dataTable = $('#chain_table tbody');
        values.forEach(function (row) {
            const tableRow = '<tr>' + row.map(col => `<td>${col}</td>`).join('') + '</tr>';
            dataTable.append(tableRow);

            const teamItemHtml = `
                <div class="col-lg-4 col-md-6 portfolio-item ${row[2]} ">
                    <div class="rounded overflow-hidden">
                        <div class="position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="img/chain/${row[6]}.jpg" alt="">
                            <div class="portfolio-overlay">
                                <a class="btn btn-square btn-outline-light mx-1" data-bs-toggle="modal" data-bs-target="#chainModal${row[4]}">
                                    <i class="fa fa-info"></i>
                                </a>
                                <a class="btn btn-square btn-outline-light mx-1 ${row[9]}" href="${row[8]}" target=”_blank”><i class="fa fa-download"></i></a>
                            </div>
                        </div>
                        <div class="bg-light p-4">
                            <p class="text-primary fw-medium mb-2">${row[3]}</p>
                            <h5 class="lh-base mb-0">${row[5]}</h5>
                        </div>
                    </div>
                </div>
                <!-- Bootstrap 5 Modal -->
                <div class="modal fade" id="chainModal${row[4]}" tabindex="-1" aria-labelledby="chainModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="chainModalLabel">${row[3]}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <!-- Modal content goes here -->
                                <h5 class="">${row[5]}</h5>
                                <p>${row[7]}</p>
                                <img class="img-fluid w-100" src="img/chain/${row[6]}.jpg" alt="">
                            </div>
                            
                        </div>
                    </div>
                </div>


            `;

            $('#chain_item').append(teamItemHtml);
        });

        // Fetch filter items data
        $.get(filterApiUrl, function (filterData) {
            const filterValues = filterData.values;

            // Dynamically generate and append the filter elements
            const filterRowDiv = document.createElement('div');
            filterRowDiv.className = 'row mt-n2';

            const filterColDiv = document.createElement('div');
            filterColDiv.className = 'col-12 text-center';

            const filterUlElement = document.createElement('ul');
            filterUlElement.className = 'list-inline mb-5';
            filterUlElement.id = 'portfolio-flters';

            // Create filterItems array dynamically based on Google Sheets data
            const filterItems = filterValues.map(row => {
                return {
                    className: 'mx-2',
                    dataFilter: row[0], // Assuming column A contains dataFilter values
                    text: row[1] // Assuming column B contains text values
                };
            });

            // Add the "全部" filter item at the beginning
            filterItems.unshift({
                className: 'mx-2 active',
                dataFilter: '*',
                text: '全部'
            });

            filterItems.forEach(item => {
                const filterLiElement = document.createElement('li');
                filterLiElement.className = item.className;
                filterLiElement.setAttribute('data-filter', item.dataFilter);
                filterLiElement.textContent = item.text || '';
                filterUlElement.appendChild(filterLiElement);
            });

            filterColDiv.appendChild(filterUlElement);
            filterRowDiv.appendChild(filterColDiv);
            $('#chain_item').before(filterRowDiv);

            // Initialize Isotope after adding portfolio items and filter elements
            const $portfolioGrid = $('#chain_item').isotope({
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            // Filtering logic for list-inline items
            $('#portfolio-flters').on('click', 'li', function () {
                const filterValue = $(this).attr('data-filter');
                $portfolioGrid.isotope({ filter: filterValue });

                // Highlight the selected filter item
                $('#portfolio-flters li').removeClass('active');
                $(this).addClass('active');

                // Toggle display based on filter
                $portfolioGrid.children().each(function () {
                    const $item = $(this);
                    const itemFilter = $item.attr('data-filter');
                    const isHidden = !($item.hasClass(filterValue) || filterValue === '*');

                    $item.toggleClass('hidden', isHidden);
                });
            });

            // Initial show all items
            $portfolioGrid.children().removeClass('hidden');
        });
    });
});

    
//資料清單
$(document).ready(function () {
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';
    const sheetId = '1KugYhhBw7lKDimouh0JT51g4XSjcrGig5Jf_bcQP3JQ';
    // Fetch data for datalist items
    const dataRange = 'datalist!A2:J48';
    const dataApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${dataRange}?key=${apiKey}`;

    // Fetch data for filter items
    const dfilterRange = 'type!A2:B7';
    const dfilterApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${dfilterRange}?key=${apiKey}`;


    // Fetch data from Google Sheets
    $.get(dataApiUrl, function (data) {
        const values = data.values;

        const dataTable = $('#datalist_item tbody');
        values.forEach(function (row) {
            const tableRow = '<tr>' + row.map(col => `<td>${col}</td>`).join('') + '</tr>';
            dataTable.append(tableRow);

            const teamItemHtml = `
                <div class="col-lg-4 col-md-6 portfolio-item ${row[0]} ">
                    <div class="rounded overflow-hidden">
                        
                        <div class="bg-light p-4">
                            <p class="text-primary fw-medium mb-2">${row[1]}</p>
                            <h6 class="lh-base">${row[2]}</h6>
                            
                            <p class="pt-1">資料單位：${row[4]}
                            <br>資料來源：${row[5]}</p>
                            <div class="d-flex justify-content-center"><a class="btn ${row[7]} mx-1 btn-sm" href="${row[9]}" target="_blank"> ${row[8]} </a></div>
                        </div>  
                        
                    </div>
                </div>
                
            `;

            $('#datalist_item').append(teamItemHtml);
        });

        // Fetch filter items data
        $.get(dfilterApiUrl, function (filterData) {
            const filterValues = filterData.values;

            // Dynamically generate and append the filter elements
            const filterRowDiv = document.createElement('div');
            filterRowDiv.className = 'row mt-n2';

            const filterColDiv = document.createElement('div');
            filterColDiv.className = 'col-12 text-center';

            const filterUlElement = document.createElement('ul');
            filterUlElement.className = 'list-inline mb-5';
            filterUlElement.id = 'portfolio-flters';

            // Create filterItems array dynamically based on Google Sheets data
            const filterItems = filterValues.map(row => {
                return {
                    className: 'mx-2',
                    dataFilter: row[0], // Assuming column A contains dataFilter values
                    text: row[1] // Assuming column B contains text values
                };
            });

            // Add the "全部" filter item at the beginning
            filterItems.unshift({
                className: 'mx-2 active',
                dataFilter: '*',
                text: '全部'
            });

            filterItems.forEach(item => {
                const filterLiElement = document.createElement('li');
                filterLiElement.className = item.className;
                filterLiElement.setAttribute('data-filter', item.dataFilter);
                filterLiElement.textContent = item.text || '';
                filterUlElement.appendChild(filterLiElement);
            });

            filterColDiv.appendChild(filterUlElement);
            filterRowDiv.appendChild(filterColDiv);
            $('#datalist_item').before(filterRowDiv);

            // Initialize Isotope after adding portfolio items and filter elements
            const $portfolioGrid = $('#datalist_item').isotope({
                itemSelector: '.portfolio-item',
                layoutMode: 'fitRows'
            });

            // Filtering logic for list-inline items
            $('#portfolio-flters').on('click', 'li', function () {
                const filterValue = $(this).attr('data-filter');
                $portfolioGrid.isotope({ filter: filterValue });

                // Highlight the selected filter item
                $('#portfolio-flters li').removeClass('active');
                $(this).addClass('active');

                // Toggle display based on filter
                $portfolioGrid.children().each(function () {
                    const $item = $(this);
                    const itemFilter = $item.attr('data-filter');
                    const isHidden = !($item.hasClass(filterValue) || filterValue === '*');

                    $item.toggleClass('hidden', isHidden);
                });
            });

            // Initial show all items
            $portfolioGrid.children().removeClass('hidden');
        });
    });
});