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

// function onSignIn() {
//   // Google OAuth 2.0 相關信息
//   const clientId = '468962731963-oeidlndjqhrkehacb2d0tpo7msqukjte.apps.googleusercontent.com';
//   const redirectUri = 'http://127.0.0.1:5500/main.html';
//   // https://sino7622.github.io/5075Z/main.html
  
//   // 登入函數
//   window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=email%20profile`;
// };

function logout() {
  // 應用程式登出邏輯
  localStorage.removeItem("loggedInUserName");
  // 其他相關清理代碼

  // 重定向到登出頁面或首頁
  window.location.href = 'index.html'; // 或其他目標頁面
  window.location.href = '../index.html'; // 或其他目標頁面
}