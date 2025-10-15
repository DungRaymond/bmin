// Khai báo biến toàn cục để lưu trữ dữ liệu cấu hình
let configData = {};

/**
 * Tải dữ liệu từ file JSON và khởi chạy render
 */
async function loadConfigData() {
    try {
        // Tải dữ liệu JSON
        const response = await fetch('https://dungraymond.github.io/bmin/badminton_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        configData = await response.json();
        
        // Sau khi tải dữ liệu thành công, gọi hàm render
        renderAll();

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu cấu hình:", error);
        document.getElementById('sub-title').textContent = "LỖI TẢI DỮ LIỆU!";
    }
}


/**
 * Tạo thanh đánh giá sao (ATK/CTRL)
 * @param {number} value - Giá trị từ 1 đến 5
 * @param {string} type - 'ATK' hoặc 'CTRL'
 * @returns {string} HTML cho thanh đánh giá
 */
function createStarRating(value, type) {
    let html = '';
    const filledClass = type === 'ATK' ? 'filled-atk' : 'filled-ctrl';
    for (let i = 1; i <= 5; i++) {
        const isFilled = i <= value;
        html += `<span class="rating-star ${isFilled ? filledClass : ''}"></span>`;
    }
    return html;
}

/**
 * Tạo thẻ cấu hình (Config Card)
 * @param {object} config - Đối tượng cấu hình vợt
 * @param {boolean} isFailed - Cấu hình bị loại bỏ/thất bại
 * @returns {string} HTML của thẻ
 */
function createConfigCard(config, isFailed = false) {
    // Xác định trạng thái để gán màu border
    let statusColor = 'border-config-experimental'; // Mặc định là Experimental

    if (!isFailed) {
        // Cần tìm cách xác định nhanh chóng mà không cần lặp qua các mảng
        // Giả sử có một trường 'status' trong JSON. Vì JSON cũ không có, ta dùng tên cước/vợt để so sánh
        const isStandard = configData.bo_cau_hinh_chuẩn.some(c => c.vot === config.vot && c.cuoc === config.cuoc && c.muc_cang === config.muc_cang);
        const isCurrent = configData.bo_cau_hinh_tam_dang_dung.some(c => c.vot === config.vot && c.cuoc === config.cuoc && c.muc_cang === config.muc_cang);
        
        if (isStandard) {
            statusColor = 'border-config-standard';
        } else if (isCurrent) {
            statusColor = 'border-config-temp';
        }
    } else {
        statusColor = 'border-config-failed';
    }


    const cardTitle = `${config.vot} + ${config.cuoc}`;
    const failedInfo = isFailed && config.ngay_du_doan 
        ? `<div class="p-2 bg-red-100 rounded-md text-red-700 text-xs font-medium">❌ Dừng từ: ${config.ngay_du_doan}</div>`
        : '';

    return `
        <div class="config-card bg-white p-5 rounded-xl card-shadow border-l-4 ${statusColor} flex flex-col justify-between">
            <div>
                <h3 class="text-xl font-bold mb-2 text-primary-dark">${cardTitle}</h3>
                ${failedInfo}
                
                <div class="grid grid-cols-2 gap-y-1 mb-3 text-sm">
                    <p class="font-medium text-gray-600">Đường Kính:</p>
                    <p class="text-gray-800 font-semibold">${config.duong_kinh}</p>

                    <p class="font-medium text-gray-600">Mức Căng:</p>
                    <p class="text-gray-800 font-semibold">${config.muc_cang}</p>
                </div>

                <div class="space-y-2 mb-4">
                    <div class="flex justify-between items-center text-sm">
                        <span class="font-bold text-accent-orange">Tấn Công (ATK):</span>
                        <div class="rating-box">${createStarRating(config.danh_gia.ATK, 'ATK')}</div>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="font-bold text-accent-green">Kiểm Soát (CTRL):</span>
                        <div class="rating-box">${createStarRating(config.danh_gia.CTRL, 'CTRL')}</div>
                    </div>
                </div>

                <div class="border-t pt-3 space-y-2">
                    <p class="text-sm font-medium text-gray-600 italic">Lối chơi:</p>
                    <p class="text-gray-800 text-sm font-medium">${config.loi_choi_phu_hop}</p>
                </div>
            </div>
            
            <div class="mt-4 pt-3 border-t">
                <p class="text-xs text-gray-700">
                    <span class="font-semibold">Ghi chú:</span> ${config.ghi_chu}
                </p>
                ${!isFailed && config.thay_the && config.thay_the !== '—' ? 
                    `<p class="text-xs text-gray-500 mt-1">
                        <span class="font-semibold">Thay thế:</span> ${config.thay_the}
                    </p>` : ''}
            </div>
        </div>
    `;
}


/**
 * Render các quy tắc chung
 */
function renderGeneralRules() {
    const rules = configData.quy_tac_chung;
    const container = document.getElementById('general-rules');
    let html = '';

    for (const key in rules) {
        if (rules.hasOwnProperty(key)) {
            // Chuyển đổi key thành tiêu đề dễ đọc
            let title = key.replace(/_/g, ' ').toUpperCase();
            if (key === 'muc_cang_chuan') title = 'MỨC CĂNG CHUẨN';
            if (key === 'muc_cang_tam_thu_nghiem') title = 'MỨC CĂNG TẠM/TN';
            if (key === 'titan_9_chuẩn') title = 'TITAN 9 CHUẨN';

            html += `
                <div class="p-3 bg-secondary-light rounded-lg">
                    <p class="text-primary-dark font-bold mb-1">${title}</p>
                    <p class="text-gray-700">${rules[key]}</p>
                </div>
            `;
        }
    }
    container.innerHTML = html;
}

/**
 * Render tất cả cấu hình vào container tương ứng
 * @param {Array} configs - Mảng cấu hình
 * @param {string} containerId - ID của div chứa
 * @param {boolean} isFailed - Cấu hình bị loại bỏ/thất bại
 */
function renderConfigs(configs, containerId, isFailed = false) {
    const container = document.getElementById(containerId);

    // Sắp xếp lại để Prediction (có ngay_du_doan) luôn ở trên cùng cho Failed Configs
    if (isFailed) {
        configs.sort((a, b) => {
            if (a.ngay_du_doan && !b.ngay_du_doan) return -1;
            if (!a.ngay_du_doan && b.ngay_du_doan) return 1;
            return 0;
        });
    }
    
    if (configs.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic p-4 border rounded-lg col-span-full">Chưa có dữ liệu cấu hình trong mục này.</p>';
        return;
    }

    container.innerHTML = configs.map(config => createConfigCard(config, isFailed)).join('');
}

/**
 * Render Bảng so sánh Hybrid/Đơn (Dữ liệu mẫu vì không có trong JSON)
 */
function renderComparisonTable() {
    const container = document.getElementById('comparison-table-container');
    
    // Dữ liệu mẫu cho Bảng so sánh
    const comparisonData = [
        { type: 'Cước Đơn', speed: 'Tốc độ ổn định', control: 'Bám cầu tốt, dễ kiểm soát', feel: 'Độ đầm nhất định', durability: 'Trung bình - Cao' },
        { type: 'Cước Hybrid', speed: 'Tốc độ tối đa', control: 'Kiểm soát nhạy (Main), độ bật cao (Cross)', feel: 'Âm thanh lớn, nảy tối đa', durability: 'Trung bình (Cross dễ đứt hơn)' }
    ];

    const tableHtml = `
        <table class="w-full text-sm text-left text-gray-700 rounded-lg overflow-hidden border border-gray-200">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                    <th scope="col" class="px-6 py-3 font-bold text-primary-dark">Loại Cấu Hình</th>
                    <th scope="col" class="px-6 py-3 font-bold text-primary-dark">Tốc Độ/Lực Nảy</th>
                    <th scope="col" class="px-6 py-3 font-bold text-primary-dark">Kiểm Soát (Control)</th>
                    <th scope="col" class="px-6 py-3 font-bold text-primary-dark">Cảm Giác</th>
                    <th scope="col" class="px-6 py-3 font-bold text-primary-dark">Độ Bền</th>
                </tr>
            </thead>
            <tbody>
                ${comparisonData.map((item, index) => `
                    <tr class="bg-white border-b ${index % 2 === 0 ? '' : 'bg-gray-50'} hover:bg-gray-100 transition duration-150">
                        <td class="px-6 py-4 font-bold text-gray-900">${item.type}</td>
                        <td class="px-6 py-4">${item.speed}</td>
                        <td class="px-6 py-4">${item.control}</td>
                        <td class="px-6 py-4">${item.feel}</td>
                        <td class="px-6 py-4">${item.durability}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHtml;
}

// Hàm chính chạy tất cả các hàm render
function renderAll() {
    document.getElementById('sub-title').textContent = configData.tieu_de;

    renderGeneralRules();
    renderConfigs(configData.bo_cau_hinh_chuẩn, 'standard-configs');
    renderConfigs(configData.bo_cau_hinh_tam_dang_dung, 'current-configs');
    renderConfigs(configData.bo_cau_hinh_thu_nghiem, 'experimental-configs');
    // Cấu hình Thất bại cần biến isFailed = true
    renderConfigs(configData.bo_thu_nghiem_that_bai, 'failed-configs', true);
    renderComparisonTable();
}

// Khởi chạy quá trình tải dữ liệu khi DOM đã tải xong
window.onload = loadConfigData;
