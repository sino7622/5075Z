const apiKey = 'AIzaSyA7xlnHb3I7Ojo4AtIIdcrPdnZ_Ael1o3Y';  // 替換成你的 Google API Key
const sheetId = '1Nko8oiUPDgIFM5sMcrQlXeyeV_fQ3ef7xA-jrtSVLKU';  // 替換成你的 Google Sheets ID
const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/PSW?key=${apiKey}`;

function validateLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var rememberMe = document.getElementById("rememberMe").checked;
  var messageElement = document.getElementById("message");

  // 檢查是否勾選了 "Remember me"
  if (rememberMe) {
    // 儲存帳號密碼至 localStorage
    localStorage.setItem("savedUsername", username);
    localStorage.setItem("savedPassword", password);
  } else {
    // 若未勾選 "Remember me"，清除 localStorage 中的資訊
    localStorage.removeItem("savedUsername");
    localStorage.removeItem("savedPassword");
  }

  // 使用 Google Sheets API 進行驗證
  fetch(sheetApiUrl)
    .then(response => response.json())
    .then(data => {
      // 在這裡檢查帳號密碼是否存在於資料庫中
      var userFound = data.values.find(user => user[0] === username && user[1] === password);

      if (userFound) {
        // Save the user's name in localStorage
        localStorage.setItem("loggedInUserName", userFound[2]);

        // 登入成功後導向至 main.html
        window.location.href = 'main.html';

      } else {
        // 更新訊息元素的內容
        messageElement.innerHTML = "<p class='text-white'>請輸入正確的帳號密碼</p>";
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // 更新訊息元素的內容
      messageElement.innerHTML = `<p class='text-white'>系統錯誤，請通知系統管理員: ${error.message}</p>`;
    });
}

// 在頁面載入時自動填充帳號密碼
window.onload = function() {
  var savedUsername = localStorage.getItem("savedUsername");
  var savedPassword = localStorage.getItem("savedPassword");

  if (savedUsername && savedPassword) {
    document.getElementById("username").value = savedUsername;
    document.getElementById("password").value = savedPassword;
  }
};