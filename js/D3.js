// 創建力導向圖的函數
function createForceDirectedGraph(data) {
  // 清空力導向圖容器
  d3.select("#network-graph-container").html("");
  // 清空 download 按鈕容器
  d3.select("#button-container").html("");
  
  // 將資料存入rawData變數
  var rawData = data;

  // 轉換資料
  var nodes = [];
  var links = [];

  rawData.forEach(function (row) {
    // 建立來源節點
    var sourceNode = { id: row.source, type: "source", group: row.group};
    if (!nodes.find(node => node.id === sourceNode.id)) {
      nodes.push(sourceNode);
    }

    // 建立目標節點
    var targetNode = { id: row.target, type: "target", group: row.group , location: row.location};
    if (!nodes.find(node => node.id === targetNode.id)) {
      nodes.push(targetNode);
    }

    // 建立連線
    var link = {
      source: row.source,
      target: row.target,
      //value: row.value * 100  // 使用特定欄位的值作為連線的值
    };
    links.push(link);
    //console.log("is_coreSource in rawData:", row.is_coreSource);
  });

  // 建立d3.js網絡圖
  var width = window.innerWidth;
  var height = window.innerHeight;

  var svg = d3.select("#network-graph-container").append("svg")
    .attr("width", width)
    .attr("height", height);

  // 建立力導向圖佈局
  var simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(200)) // 調整連線的長度
    .force("charge", d3.forceManyBody().strength(-100).distanceMax(350)) // 調整節點之間的最大排斥距離和排斥強度
    .force("center", d3.forceCenter(width / 2, height / 2));

  // 建立 forceCollide 力量
  var collisionForce = d3.forceCollide().radius(50); // 調整 radius 的值

  // 將 forceCollide 加入到 simulation 中
  simulation.force("collision", collisionForce);

  // 初始節點位置的設定
  nodes.forEach(function (node) {
    node.x = Math.random() * width;  // 這裡使用亂數設定 x 座標
    node.y = Math.random() * height; // 這裡使用亂數設定 y 座標
  });

  // 在連線上使用箭頭
  var link = svg.selectAll("line")
    .data(links)
    .enter().append("line")
    .style("stroke", d3.rgb(169, 169, 180))
    .style("stroke-width", 1.5)  // 指定連線寬度
    .attr("marker-end", "url(#arrow)");

  // 創建箭頭
  svg.append("defs").append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 18)
  .attr("refY", 0)
  .attr("markerWidth", 8)
  .attr("markerHeight", 8)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("class", "arrowhead")
  .attr("fill", "rgb(169, 169, 180)");  // 設定箭頭的顏色;

  // 繪製節點
  var node = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("r", 8)
    .attr("class", function (d) {
      // 根據節點的類型為節點添加不同的類別
      return d.type === "source" ? "node source-node" : "node target-node";
    })
    // 指定節點顏色
    .attr("fill", function (d) {
      if (d.type === "source") {
        return d3.rgb(0, 153, 179);
      } else if (d.type === "target") {
        return d3.rgb(193, 141, 186);
      } else {return d3.rgb(193, 141, 186);}
    })
    
    .on("mouseover", handleMouseOver)  // 新增滑鼠移到事件
    .on("mouseout", handleMouseOut)    // 新增滑鼠離開事件
    .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));  // 新增拖曳事件
  // 將 source 的節點移到最上層
    svg.selectAll(".source-node").raise();
  // 定義滑鼠移到事件處理函數
  function handleMouseOver(d, i) {
    d3.select(this).style("cursor", "pointer");  // 變更滑鼠形狀為手指
  }

  // 定義滑鼠離開事件處理函數
  function handleMouseOut(d, i) {
    d3.select(this).style("cursor", "default");  // 變回預設滑鼠形狀
  }
  /////////////////////////////////////////////  按鈕切換節點標籤 ///////////////////////////////////////////// 
  var buttonsContainer = d3.select("#button-container");
  // 新增按鈕切換節點標籤顯示
  buttonsContainer.append("button")
    .attr("id", "toggle-label-button")
    .attr("class", "btn btn-primary m-2")
    .attr("type", "button")
    .text("關閉節點標籤")
    .on("click", function () {
      // 切換節點標籤的顯示狀態
      var currentDisplay = label.style("display");
      var newDisplay = currentDisplay === "block" ? "none" : "block";

      // 設定節點標籤的顯示狀態
      label.style("display", newDisplay);
    });
    /////////////////////////////////////////////  按鈕切換節點標籤 /////////////////////////////////////////////

  // 繪製節點標籤
  var label = svg.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .text(d => d.id)
    .attr("x", 10)
    .attr("y", 5)
    .style("display", "block");  // 預設顯示

  // 更新節點和連線位置
  simulation.on("tick", function () {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
  });

  ///////////////////////////////////////////// 定義拖曳事件處理函數 /////////////////////////////////////////////
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();  // 啟動模擬器
    d.fx = d.x;  // 固定節點的x座標
    d.fy = d.y;  // 固定節點的y座標
  }

  function dragged(d) {
    // 更新固定的x座標，確保在 SVG 的寬度範圍內
    d.fx = Math.max(0, Math.min(width, d3.event.x));
    // 更新固定的y座標，確保在 SVG 的高度範圍內
    d.fy = Math.max(0, Math.min(height, d3.event.y));
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);  // 停止模擬器
    d.fx = null;  // 解除固定的x座標
    d.fy = null;  // 解除固定的y座標
  }
  ///////////////////////////////////////////// 定義拖曳事件處理函數 /////////////////////////////////////////////

  ///////////////////////////////////////////// 下載按鈕 /////////////////////////////////////////////
  // Create buttonsContainer variable
  var buttonsContainer = d3.select("#button-container");
  buttonsContainer.append("button")
    .attr("id", "download-button")
    .attr("class", "btn btn-primary m-2")
    .attr("type", "button")
    .text("下載網絡圖")
    .on("click", downloadImage);

  // Create a function to download the network graph as an image
  function downloadImage() {
    var dropdown = d3.select("#group-dropdown");
    var selectedGroup = dropdown.node().value;
    // Select the main SVG element (not a group)
    var svg = d3.select("#network-graph-container svg");

    // Serialize the SVG to a data URL
    var svgString = new XMLSerializer().serializeToString(svg.node());

    // Convert SVG to canvas using canvg
    var canvas = document.createElement("canvas");
    canvg(canvas, svgString);

    // Convert canvas to data URL
    var dataURL = canvas.toDataURL("image/png");

    // Create a download link
    var link = document.createElement("a");
    link.href = dataURL;
    link.download = selectedGroup + "_network_graph.png";  // Set the filename
    link.click();
  }
  ///////////////////////////////////////////// 下載按鈕 /////////////////////////////////////////////

  ///////////////////////////////////////////// 創建縮放函數 /////////////////////////////////////////////
  var zoom = d3.zoom()
    .scaleExtent([0.1, 10])  // 設定縮放範圍
    .on("zoom", zoomed);

  // 將縮放函數應用到 SVG 元素
  svg.call(zoom);

  // 定義縮放事件處理函數
  function zoomed() {
    // 取得目前的縮放狀態
    var transform = d3.event.transform;

    // 更新節點和連線的位置
    node.attr("transform", transform);
    link.attr("transform", transform);
    label.attr("transform", transform);
  }
  ///////////////////////////////////////////// 創建縮放函數 /////////////////////////////////////////////

}

// 使用d3.csv讀取CSV檔案
d3.select("#group-dropdown").on("change", function () {
  var selectedGroup = this.value;
  if (selectedGroup) {
    // 讀取CSV檔案
    d3.csv("https://github.com/sino7622/5075Z/blob/main/csv/Gmerge_2016.csv").then(function (data) {
      // 過濾資料
      var filteredData = data.filter(function (d) {
        return d.name === selectedGroup;
      });

      // 呼叫創建力導向圖的函數
      createForceDirectedGraph(filteredData);
    });
  } else {
    // 清空力導向圖容器
    d3.select("#network-graph-container").html("");
    // 清空篩選後的資料
    filteredData = null;
  }
  
});

// 初始化畫面
d3.csv("../csv/Gmerge_2016.csv").then(function (data) {
  ///////////////////////////////////////////// 下拉選單篩選設置 /////////////////////////////////////////////
  var uniqueGroups = [...new Set(data.map(d => d.name))];
  //var taiwanFilterButton = d3.select("#taiwan-filter-container");
  // 在陣列最前面插入一個空白字串
  uniqueGroups.unshift("");

  // 將 uniqueGroups 設定為下拉選單的選項
  var dropdown = d3.select("#group-dropdown");
  dropdown.selectAll("option")
    .data(uniqueGroups)
    .enter().append("option")
    .text(function (d) { return d; });

  // 選擇下拉選單中的所有選項元素
  var options = dropdown.selectAll("option")
    .data(uniqueGroups);

  // 處理現有的選項元素
  options
   .attr("class", "form-select form-select-lg m-2")
   .text(function (d) { return d; });

  // 處理新增的選項元素
  options.enter().append("option")
   .attr("class", "form-select form-select-lg m-2")
   .text(function (d) { return d; });
  
  // 監聽搜尋框輸入事件
  d3.select("#search-input").on("input", function () {
    updateDropdownFilter();
  });

  // 監聽下拉選單變更事件
  dropdown.on("change", function () {
    var selectedGroup = this.value;
    if (selectedGroup) {
      // 讀取CSV檔案
      updateFilters();
    } else {
      // 清空力導向圖容器及按鈕
      d3.select("#network-graph-container").html("");
      d3.select("#button-container").html("");

    }
  });

  // 定義僅更新下拉選單篩選的函數
  function updateDropdownFilter() {
    var searchText = d3.select("#search-input").node().value.toLowerCase();

    // 更新下拉選單的選項
    var filteredOptions = uniqueGroups.filter(function (group) {
      return group.toLowerCase().includes(searchText);
    });

    var filteredOptionsData = d3.select("#group-dropdown").selectAll("option")
      .data(filteredOptions);

    filteredOptionsData.enter().append("option")
      .merge(filteredOptionsData)
      .text(function (d) { return d; });

    filteredOptionsData.exit().remove();
  }

  // 定義篩選函數
  function updateFilters() {
    var searchText = d3.select("#search-input").node().value.toLowerCase();
    var selectedGroup = dropdown.node().value;

    // // 過濾資料
    // var filteredData = data.filter(function (d) {
    //   return (selectedGroup === "" || d.name === selectedGroup) &&
    //          (d.name.toLowerCase().includes(searchText)) 
    // });
    // 過濾資料
    var filteredData = data.filter(function (d) {
      var matchesGroup = selectedGroup === "" || d.name === selectedGroup;
      return matchesGroup;
    });
    // 呼叫創建力導向圖的函數
    createForceDirectedGraph(filteredData);
    
  }
});



