//產業鏈清單
$(document).ready(function () {
    const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';
    const sheetId = '1fOub1yuYBMmABDRcWJm4PnRiYjXyw2-fxGt7sqilvQ4';
    // Fetch data for chain items
    const chainRange = 'chain!A2:G86';
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
                            <img class="img-fluid w-100" src="img_chain/${row[6]}.jpg" alt="">
                            <div class="portfolio-overlay">
                                <a class="btn btn-square btn-outline-light mx-1" href="img_chain/${row[6]}.jpg" data-lightbox="portfolio"><i class="fa fa-eye"></i></a>
                                <a class="btn btn-square btn-outline-light mx-1" href=""><i class="fa fa-link"></i></a>
                            </div>
                        </div>
                        <div class="bg-light p-4">
                            <p class="text-primary fw-medium mb-2">${row[3]}</p>
                            <h5 class="lh-base mb-0">${row[5]}</h5>
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