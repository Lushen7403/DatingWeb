import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { getAllPayments } from '@/lib/adminPaymentApi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = (pdfFonts as any).vfs;

const AdminInvoices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPayments(currentPage, itemsPerPage);
        setInvoices(data.payments);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Không thể tải danh sách hóa đơn');
      }
    };
    fetchData();
  }, [currentPage]);

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.id.toString().includes(searchQuery) ||
    (invoice.account?.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: boolean) => {
    if (status === true) return 'success';
    if (status === false) return 'destructive';
    return 'default';
  };

  const handleDownloadInvoice = (id: string) => {
    toast.success('Đang tải hóa đơn...');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Xuất 1 hóa đơn ra excel (đẹp hơn)
  const handleExportInvoice = (invoice: any) => {
    // Tạo workbook mới
    const wb = XLSX.utils.book_new();
    
    // Tạo worksheet
    const ws = XLSX.utils.aoa_to_sheet([]);

    // Thêm dữ liệu với định dạng
    const data = [
      // Logo và thông tin công ty
      ['LOVEMATCH - HỆ THỐNG HẸN HÒ TRỰC TUYẾN'],
      ['Địa chỉ: 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh'],
      ['Hotline: 1900 123 456 | Email: nguyenvantu7403@gmail.com'],
      [''],
      ['BÁO CÁO HÓA ĐƠN'],
      [''],
      // Thông tin hóa đơn
      ['Mã hóa đơn:', invoice.id],
      ['Ngày xuất:', new Date().toLocaleString('vi-VN')],
      [''],
      // Tiêu đề cột
      [
        'Mã hóa đơn',
        'Người dùng',
        'Gói nạp',
        'Tiền gốc',
        'Giảm giá',
        'Thực trả',
        'Mã giảm giá',
        '% Giảm',
        'Thời gian thanh toán',
        'Trạng thái',
        'Ngân hàng',
        'Mã GD ngân hàng',
      ],
      // Dữ liệu
      [
        invoice.id,
        invoice.account?.userName,
        invoice.package?.diamondCount + ' KC',
        formatCurrency(invoice.amountBefore),
        formatCurrency(invoice.discountAmount),
        formatCurrency(invoice.amountAfter),
        invoice.voucher?.code || '-',
        invoice.voucher?.discountPercent ? `${invoice.voucher.discountPercent}%` : '-',
        invoice.vnpPayDate ? new Date(invoice.vnpPayDate).toLocaleString('vi-VN') : '-',
        invoice.status ? 'Thành công' : 'Thất bại',
        invoice.vnpBankCode,
        invoice.vnpBankTranNo,
      ],
      [''],
      // Tổng kết
      ['Tổng kết:'],
      ['Số tiền gốc:', formatCurrency(invoice.amountBefore)],
      ['Giảm giá:', formatCurrency(invoice.discountAmount)],
      ['Thực trả:', formatCurrency(invoice.amountAfter)],
      [''],
      // Chữ ký
      ['Xác nhận của LoveMatch', '', '', '', '', '', '', '', '', '', '', ''],
      [''],
      ['Người lập phiếu', '', '', '', '', '', '', '', '', '', '', ''],
      [''],
      ['(Ký, ghi rõ họ tên)', '', '', '', '', '', '', '', '', '', '', ''],
    ];

    // Thêm dữ liệu vào worksheet
    XLSX.utils.sheet_add_aoa(ws, data);

    // Gộp ô
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }, // Logo
      { s: { r: 1, c: 0 }, e: { r: 1, c: 11 } }, // Địa chỉ
      { s: { r: 2, c: 0 }, e: { r: 2, c: 11 } }, // Hotline
      { s: { r: 4, c: 0 }, e: { r: 4, c: 11 } }, // BÁO CÁO HÓA ĐƠN
      { s: { r: 6, c: 1 }, e: { r: 6, c: 11 } }, // Mã hóa đơn
      { s: { r: 7, c: 1 }, e: { r: 7, c: 11 } }, // Ngày xuất
      { s: { r: 15, c: 0 }, e: { r: 15, c: 11 } }, // Tổng kết
      { s: { r: 16, c: 1 }, e: { r: 16, c: 11 } }, // Số tiền gốc
      { s: { r: 17, c: 1 }, e: { r: 17, c: 11 } }, // Giảm giá
      { s: { r: 18, c: 1 }, e: { r: 18, c: 11 } }, // Thực trả
      { s: { r: 20, c: 0 }, e: { r: 20, c: 11 } }, // Chữ ký
      { s: { r: 22, c: 0 }, e: { r: 22, c: 11 } }, // Người lập phiếu
      { s: { r: 24, c: 0 }, e: { r: 24, c: 11 } }, // Ký tên
    ];

    // Định dạng độ rộng cột
    ws['!cols'] = [
      { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, 
      { wch: 14 }, { wch: 14 }, { wch: 8 }, { wch: 22 }, { wch: 12 }, 
      { wch: 10 }, { wch: 18 }
    ];

    // Định dạng style cho từng ô
    const styleMap = {
      // Tiêu đề công ty
      'A1': { font: { sz: 16, bold: true, color: { rgb: "FF1493" } }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { fgColor: { rgb: "FFF0F5" } } },
      'A2': { font: { sz: 12, color: { rgb: "4B0082" } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: "F8F8FF" } } },
      'A3': { font: { sz: 12, color: { rgb: "4B0082" } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: "F8F8FF" } } },
      // Tiêu đề báo cáo
      'A5': { font: { sz: 14, bold: true, color: { rgb: "FF1493" } }, alignment: { horizontal: 'center', vertical: 'center' }, fill: { fgColor: { rgb: "FFF0F5" } } },
      // Thông tin hóa đơn
      'A7': { font: { bold: true, color: { rgb: "4B0082" } }, fill: { fgColor: { rgb: "F8F8FF" } } },
      'A8': { font: { bold: true, color: { rgb: "4B0082" } }, fill: { fgColor: { rgb: "F8F8FF" } } },
      // Tổng kết
      'A16': { font: { bold: true, color: { rgb: "FF1493" } }, fill: { fgColor: { rgb: "FFF0F5" } } },
      'A17': { font: { bold: true, color: { rgb: "4B0082" } }, fill: { fgColor: { rgb: "F8F8FF" } } },
      'A18': { font: { bold: true, color: { rgb: "4B0082" } }, fill: { fgColor: { rgb: "F8F8FF" } } },
      'A19': { font: { bold: true, color: { rgb: "4B0082" } }, fill: { fgColor: { rgb: "F8F8FF" } } },
      // Chữ ký
      'A21': { font: { bold: true, color: { rgb: "FF1493" } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: "FFF0F5" } } },
      'A23': { font: { bold: true, color: { rgb: "4B0082" } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: "F8F8FF" } } },
      'A25': { font: { italic: true, color: { rgb: "4B0082" } }, alignment: { horizontal: 'center' }, fill: { fgColor: { rgb: "F8F8FF" } } },
    };

    // Áp dụng styles cho từng ô
    Object.entries(styleMap).forEach(([cell, style]) => {
      if (ws[cell]) {
        ws[cell].s = style;
      }
    });

    // Áp dụng style cho tiêu đề cột
    for (let c = 0; c < 12; c++) {
      const cell = XLSX.utils.encode_cell({ r: 10, c });
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: 'center' },
          fill: { fgColor: { rgb: "FF1493" } },
          border: {
            top: { style: 'thin', color: { rgb: "FF1493" } },
            left: { style: 'thin', color: { rgb: "FF1493" } },
            right: { style: 'thin', color: { rgb: "FF1493" } },
            bottom: { style: 'thin', color: { rgb: "FF1493" } }
          }
        };
      }
    }

    // Áp dụng style cho dữ liệu
    for (let c = 0; c < 12; c++) {
      const cell = XLSX.utils.encode_cell({ r: 11, c });
      if (ws[cell]) {
        ws[cell].s = {
          alignment: { horizontal: [3,4,5].includes(c) ? 'right' : 'center' },
          fill: { fgColor: { rgb: "FFF0F5" } },
          border: {
            top: { style: 'thin', color: { rgb: "FF1493" } },
            left: { style: 'thin', color: { rgb: "FF1493" } },
            right: { style: 'thin', color: { rgb: "FF1493" } },
            bottom: { style: 'thin', color: { rgb: "FF1493" } }
          }
        };
      }
    }

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, 'BaoCaoHoaDon');

    // Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `BaoCao_HoaDon_${invoice.id}.xlsx`);
  };

  // Thay thế hàm xuất PDF bằng pdfmake
  const handleExportInvoicePDF = (invoice: any) => {
    const infoRows = [
      ['Mã hóa đơn', invoice.id],
      ['Người dùng', invoice.account?.userName],
      ['Gói nạp', invoice.package?.diamondCount + ' KC'],
      ['Tiền gốc', formatCurrency(invoice.amountBefore)],
      ['Giảm giá', formatCurrency(invoice.discountAmount)],
      ['Thực trả', formatCurrency(invoice.amountAfter)],
      ['Mã giảm giá', invoice.voucher?.code || '-'],
      ['% Giảm', invoice.voucher?.discountPercent ? `${invoice.voucher.discountPercent}%` : '-'],
      ['Thời gian thanh toán', invoice.vnpPayDate ? new Date(invoice.vnpPayDate).toLocaleString('vi-VN') : '-'],
      ['Trạng thái', invoice.status ? 'Thành công' : 'Thất bại'],
      ['Ngân hàng', invoice.vnpBankCode],
      ['Mã GD ngân hàng', invoice.vnpBankTranNo],
    ];
    const docDefinition = {
      content: [
        { text: 'LOVEMATCH - HỆ THỐNG HẸN HÒ TRỰC TUYẾN', style: 'header', alignment: 'center', color: '#FF1493' },
        { text: 'Hotline: 1900 123 456 | Email: nguyenvantu7403@gmail.com', style: 'subheader', alignment: 'center' },
        { text: ' ', margin: [0, 0, 0, 8] },
        { text: 'PHIẾU HÓA ĐƠN', style: 'title', alignment: 'center', color: '#FF1493', margin: [0, 0, 0, 8] },
        { text: `Ngày xuất: ${new Date().toLocaleString('vi-VN')}`, alignment: 'right', margin: [0, 0, 0, 8] },
        {
          table: {
            widths: ['35%', '65%'],
            body: [
              [
                { text: 'Trường', style: 'tableHeader', fillColor: '#FF1493', color: 'white', alignment: 'center' },
                { text: 'Giá trị', style: 'tableHeader', fillColor: '#FF1493', color: 'white', alignment: 'center' }
              ],
              ...infoRows.map(([label, value]) => [
                { text: label, alignment: 'left' },
                { text: value, alignment: 'left' }
              ])
            ]
          },
          layout: 'grid',
          margin: [60, 0, 60, 12],
        },
        {
          columns: [
            [
              { text: 'TỔNG KẾT:', color: '#FF1493', bold: true, margin: [0, 0, 0, 4] },
              { text: `Số tiền gốc: ${formatCurrency(invoice.amountBefore)}` },
              { text: `Giảm giá: ${formatCurrency(invoice.discountAmount)}` },
              { text: `Thực trả: ${formatCurrency(invoice.amountAfter)}` },
            ],
            [
              { text: 'Xác nhận của LoveMatch', alignment: 'right', color: '#FF1493', margin: [0, 0, 0, 4] },
              { text: 'Người lập phiếu', alignment: 'right' },
              { text: '(Ký, ghi rõ họ tên)', alignment: 'right' }
            ]
          ]
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] },
        subheader: { fontSize: 12, margin: [0, 0, 0, 2] },
        title: { fontSize: 15, bold: true, margin: [0, 0, 0, 8] },
        tableHeader: { bold: true, fontSize: 12 },
      },
      defaultStyle: {
        font: 'Roboto',
      },
    };
    pdfMake.createPdf(docDefinition).download(`HoaDon_${invoice.id}.pdf`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Quản lý hóa đơn</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo ID, tên người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {/* Desktop view */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[70px]">Mã hóa đơn</TableHead>
                  <TableHead className="min-w-[90px]">Người dùng</TableHead>
                  <TableHead className="min-w-[70px]">Gói nạp</TableHead>
                  <TableHead className="min-w-[80px]">Tiền gốc</TableHead>
                  <TableHead className="min-w-[80px]">Giảm giá</TableHead>
                  <TableHead className="min-w-[80px]">Thực trả</TableHead>
                  <TableHead className="min-w-[90px]">Mã giảm giá</TableHead>
                  <TableHead className="min-w-[60px]">% Giảm</TableHead>
                  <TableHead className="min-w-[120px]">Thời gian thanh toán</TableHead>
                  <TableHead className="min-w-[80px]">Trạng thái</TableHead>
                  <TableHead className="min-w-[70px]">Ngân hàng</TableHead>
                  <TableHead className="min-w-[110px]">Mã GD ngân hàng</TableHead>
                  <TableHead className="min-w-[90px]">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.account?.userName}</TableCell>
                    <TableCell>{invoice.package?.diamondCount} KC</TableCell>
                    <TableCell>{formatCurrency(invoice.amountBefore)}</TableCell>
                    <TableCell>{formatCurrency(invoice.discountAmount)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amountAfter)}</TableCell>
                    <TableCell>{invoice.voucher?.code || '-'}</TableCell>
                    <TableCell>{invoice.voucher?.discountPercent ? `${invoice.voucher.discountPercent}%` : '-'}</TableCell>
                    <TableCell>{invoice.vnpPayDate ? new Date(invoice.vnpPayDate).toLocaleString('vi-VN') : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status) as any}>
                        {invoice.status ? 'Thành công' : 'Thất bại'}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.vnpBankCode}</TableCell>
                    <TableCell>{invoice.vnpBankTranNo}</TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Button variant="outline" size="sm" onClick={() => handleExportInvoice(invoice)} title="Xuất Excel">
                          <Download className="h-4 w-4 mr-1 text-blue-600" /> Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExportInvoicePDF(invoice)} title="Xuất PDF">
                          <FileText className="h-4 w-4 mr-1 text-red-600" /> PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center p-4 gap-2 bg-white rounded-lg shadow mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            size="sm"
          >
            Trước
          </Button>
          <span className="mx-2 text-sm lg:text-base">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            size="sm"
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices; 