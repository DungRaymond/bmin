function renderComparisonTable(data) {
      const container = document.getElementById('comparison-table');
      const rows = data.so_sanh_nhanh_hybrid_va_don;
      if (!rows || rows.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">Không có dữ liệu so sánh nhanh.</p>';
        return;
      }
      const columnKeys = Object.keys(rows[0]).filter(k => k !== 'tieu_chi');
      const columnNames = {
        nbg95_exbolt63: 'NBG95/EXBOLT 63',
        bg80_66um: 'BG80/66UM',
        kizuna_z69t: 'Kizuna Z69T',
        yonex_aerobite: 'Aerobite'
      };
      container.innerHTML = `
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-100 w-1/4 rounded-tl-xl">Tiêu Chí</th>
              ${columnKeys.map(k => `<th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">${columnNames[k] || k.toUpperCase()}</th>`).join('')}
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${rows.map(row => `
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-dark sticky left-0 bg-white">${row.tieu_chi}</td>
                ${columnKeys.map(k => `<td class="px-6 py-4 whitespace-normal text-sm text-gray-700 text-center">${row[k]}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }