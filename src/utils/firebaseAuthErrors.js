const firebaseAuthErrors = {
  "auth/email-already-exists": "Email đã tốn tại.",
  "auth/user-not-found": "Tài khoản không tồn tại.",
  "auth/invalid-credential": "Thông tin đăng nhập không đúng",
  "auth/invalid-password": "Sai mật khẩu.",
  "auth/invalid-email": "Email không hợp lệ.",
  "auth/too-many-requests": "Đăng nhập quá nhiều lần. Vui lòng thử lại sau.",
  "auth/unauthorized-continue-uri": "Không có quyền truy cập",
}

export const getAuthErrorMessage = function (code) {
  return firebaseAuthErrors[code] || "Đã xảy ra lỗi xác thực. Vui lòng thử lại."
}
