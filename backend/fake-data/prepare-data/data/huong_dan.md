# Tích hợp dữ liệu Vaccine

## Các bước thực hiện

### 1. Import `vaccine.json` vào CSDL

-   Thêm dữ liệu từ file `vaccine.json` vào cơ sở dữ liệu.

### 2. Xử lý các file `vaccine-detail.json`

-   Với mỗi file `vaccine-detail.json`, đổi tên các trường sang tiếng Anh.  
-   Ví dụ chuyển đổi:

```json
{
    "sku": "vac-xin-ivacflu-s",
    "description": "Vắc xin Ivacflu – S phòng 3 chủng cúm A(H3N2), cúm A(H1N1),và cúm B (Victoria/Yamagata).",
    "Nguồn gốc": "Vắc xin Ivacflu – S được nghiên cứu và sản xuất bởi Viện Vắc xin và Sinh phẩm Y tế IVAC – Việt Nam.",
    "Đường tiêm": "Vắc xin Ivacflu-S được sử dụng qua đường tiêm bắp. Vị trí tiêm: Cơ delta (bắp cánh tay). Không được tiêm vắc xin vào mạch máu."
}
```

⬇️ Sau khi chuyển đổi:

```json
{
    "sku": "vac-xin-ivacflu-s",
    "origin": "Vắc xin Ivacflu – S được nghiên cứu ...",
    "injection_route": ["Tiêm bắp."]
}
```

-   Sau đó thêm dữ liệu đã chuẩn hoá này vào cơ sở dữ liệu.

### 3. Join dữ liệu

-   Thực hiện **SQL JOIN** trên trường `sku` để nối dữ liệu từ hai bảng.

### 4. Xuất dữ liệu cuối cùng

-   Export bộ dữ liệu đã join để sử dụng về sau.

## Ghi chú

-   Đảm bảo tất cả các key trong `vaccine-detail.json` đều được đổi sang tiếng Anh  
    (ví dụ: `origin`, `injection_route`, …).  
-   Giữ cấu trúc thống nhất giữa tất cả các bản ghi trước khi insert vào CSDL.  
