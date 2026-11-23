import type { FamilyGeneration } from '../types/app'

export const familyGenerations: FamilyGeneration[] = [
  {
    label: 'ĐỜI THỨ NHẤT',
    members: [
      { id: 'doan-van-an', role: 'Thủy tổ', name: 'Đoàn Văn An', years: '1918 — 1996' },
      { id: 'nguyen-thi-sen', role: 'Thủy tổ', name: 'Nguyễn Thị Sen', years: '1922 — 2004' },
    ],
  },
  {
    label: 'ĐỜI THỨ HAI',
    members: [
      { id: 'doan-van-hai', role: 'Trưởng nam', name: 'Đoàn Văn Hải', years: '1945 — 2019', parents: 'Đoàn Văn An, Nguyễn Thị Sen', partner: 'Lê Thị Mai' },
      { id: 'doan-thi-ba', role: 'Trưởng nữ', name: 'Đoàn Thị Ba', years: 'Sinh năm 1950', parents: 'Đoàn Văn An, Nguyễn Thị Sen' },
      { id: 'doan-van-tu', role: 'Thứ nam', name: 'Đoàn Văn Tư', years: 'Sinh năm 1954', parents: 'Đoàn Văn An, Nguyễn Thị Sen', partner: 'Phạm Thị Liên' },
    ],
  },
  {
    label: 'ĐỜI THỨ BA',
    members: [
      { id: 'doan-minh-khang', role: 'Con trưởng', name: 'Đoàn Minh Khang', years: 'Sinh năm 1974', parents: 'Đoàn Văn Hải, Lê Thị Mai' },
      { id: 'doan-tan-phong', role: 'Thành viên', name: 'Đoàn Tấn Phong', years: 'Sinh năm 1998', parents: 'Đoàn Minh Khang', current: true },
      { id: 'doan-thu-huong', role: 'Thành viên', name: 'Đoàn Thu Hương', years: 'Sinh năm 2001', parents: 'Đoàn Minh Khang' },
      { id: 'doan-gia-bao', role: 'Thành viên', name: 'Đoàn Gia Bảo', years: 'Sinh năm 2005', parents: 'Đoàn Văn Tư, Phạm Thị Liên' },
    ],
  },
]
