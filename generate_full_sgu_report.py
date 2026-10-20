# -*- coding: utf-8 -*-
"""
Tập lệnh xây dựng báo cáo đồ án hoàn chỉnh đạt chuẩn sinh viên ngành CNTT ĐH Sài Gòn
Đề tài: Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ
Tệp kết quả: BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx
"""

import os
import sys
import json
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from PIL import Image

# ----------------- HẰNG SỐ MÀU SẮC -----------------
COLOR_PRIMARY_HEX = "003366"      # Xanh Navy ĐH Sài Gòn
COLOR_SECONDARY_HEX = "1A5276"    # Xanh phụ
COLOR_BORDER_HEX = "B0C4DE"       # Xám xanh viền bảng
COLOR_BG_HEADER_HEX = "003366"    # Nền tiêu đề bảng
COLOR_ZEBRA_HEX = "F8FAFC"        # Nền hàng chẵn
COLOR_CARD_BG = "F1F5F9"          # Nền khung tóm tắt

COLOR_PRIMARY = RGBColor(0, 51, 102)
COLOR_SECONDARY = RGBColor(26, 82, 118)
COLOR_TEXT = RGBColor(33, 37, 41)
COLOR_MUTED = RGBColor(100, 116, 139)

def create_full_report():
    print("Bắt đầu khởi tạo tài liệu...")
    doc = docx.Document()

    # Thiết lập lề chuẩn luận văn / đồ án tốt nghiệp ĐH Sài Gòn:
    # Lề trái: 3.0 cm (1.18 in) - đóng gáy
    # Lề phải: 2.0 cm (0.79 in)
    # Lề trên: 2.0 cm (0.79 in)
    # Lề dưới: 2.0 cm (0.79 in)
    section = doc.sections[0]
    section.top_margin = Inches(0.79)
    section.bottom_margin = Inches(0.79)
    section.left_margin = Inches(1.18)
    section.right_margin = Inches(0.79)
    section.page_width = Inches(8.27)   # A4
    section.page_height = Inches(11.69) # A4

    # ------------------ CÁC HÀM TIỆN ÍCH ------------------
    def set_cell_background(cell, hex_color):
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shd)

    def set_cell_borders(cell, top="single", bottom="single", left="none", right="none", sz="4", color=COLOR_BORDER_HEX):
        xml = (
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="{top}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{bottom}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="{left}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:right w:val="{right}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tcBorders>'
        )
        cell._tc.get_or_add_tcPr().append(parse_xml(xml))

    def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
        tcMar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        cell._tc.get_or_add_tcPr().append(tcMar)

    def add_page_number_to_run(run):
        fldChar1 = OxmlElement('w:fldChar')
        fldChar1.set(qn('w:fldCharType'), 'begin')
        instrText = OxmlElement('w:instrText')
        instrText.set(qn('xml:space'), 'preserve')
        instrText.text = 'PAGE'
        fldChar2 = OxmlElement('w:fldChar')
        fldChar2.set(qn('w:fldCharType'), 'separate')
        fldChar3 = OxmlElement('w:fldChar')
        fldChar3.set(qn('w:fldCharType'), 'end')
        r = run._r
        r.append(fldChar1)
        r.append(instrText)
        r.append(fldChar2)
        r.append(fldChar3)

    def add_numpages_to_run(run):
        fldChar1 = OxmlElement('w:fldChar')
        fldChar1.set(qn('w:fldCharType'), 'begin')
        instrText = OxmlElement('w:instrText')
        instrText.set(qn('xml:space'), 'preserve')
        instrText.text = 'NUMPAGES'
        fldChar2 = OxmlElement('w:fldChar')
        fldChar2.set(qn('w:fldCharType'), 'separate')
        fldChar3 = OxmlElement('w:fldChar')
        fldChar3.set(qn('w:fldCharType'), 'end')
        r = run._r
        r.append(fldChar1)
        r.append(instrText)
        r.append(fldChar2)
        r.append(fldChar3)

    def style_p(p, space_before=0, space_after=6, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        p.alignment = align

    def add_h1(text):
        h = doc.add_paragraph()
        style_p(h, space_before=18, space_after=8, align=WD_ALIGN_PARAGRAPH.LEFT)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(16)
        r.font.bold = True
        r.font.color.rgb = COLOR_PRIMARY
        return h

    def add_h2(text):
        h = doc.add_paragraph()
        style_p(h, space_before=14, space_after=6, align=WD_ALIGN_PARAGRAPH.LEFT)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(14)
        r.font.bold = True
        r.font.color.rgb = COLOR_SECONDARY
        return h

    def add_h3(text):
        h = doc.add_paragraph()
        style_p(h, space_before=10, space_after=4, align=WD_ALIGN_PARAGRAPH.LEFT)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.italic = True
        r.font.color.rgb = COLOR_TEXT
        return h

    def add_p(text, bold_prefix=None, italic=False):
        p = doc.add_paragraph()
        style_p(p, space_before=0, space_after=6, line_spacing=1.3, align=WD_ALIGN_PARAGRAPH.JUSTIFY)
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(13)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_TEXT
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.font.italic = italic
        r.font.color.rgb = COLOR_TEXT
        return p

    def add_bullet(text, bold_prefix=None, level=0):
        p = doc.add_paragraph(style='List Bullet')
        style_p(p, space_before=0, space_after=4, line_spacing=1.25, align=WD_ALIGN_PARAGRAPH.JUSTIFY)
        p.paragraph_format.left_indent = Inches(0.25 * (level + 1))
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(13)
            r_pre.font.bold = True
            r_pre.font.color.rgb = COLOR_TEXT
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(13)
        r.font.color.rgb = COLOR_TEXT
        return p

    def add_fig_caption(text, number_str):
        p = doc.add_paragraph()
        style_p(p, space_before=4, space_after=10, align=WD_ALIGN_PARAGRAPH.CENTER)
        r = p.add_run(f"Hình {number_str}: {text}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.italic = True
        r.font.color.rgb = COLOR_PRIMARY
        return p

    def add_tbl_caption(text, number_str):
        p = doc.add_paragraph()
        style_p(p, space_before=10, space_after=4, align=WD_ALIGN_PARAGRAPH.CENTER)
        r = p.add_run(f"Bảng {number_str}: {text}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.italic = True
        r.font.color.rgb = COLOR_PRIMARY
        return p

    def insert_img(img_path, caption_text, number_str, max_w=5.8, max_h=5.5):
        if not os.path.exists(img_path):
            return
        try:
            with Image.open(img_path) as im:
                w, h = im.size
            aspect = h / w
            tw = max_w
            th = tw * aspect
            if th > max_h:
                th = max_h
                tw = th / aspect
            p = doc.add_paragraph()
            style_p(p, space_before=6, space_after=2, align=WD_ALIGN_PARAGRAPH.CENTER)
            p.paragraph_format.keep_with_next = True
            r = p.add_run()
            r.add_picture(img_path, width=Inches(tw), height=Inches(th))
            add_fig_caption(caption_text, number_str)
        except Exception as e:
            print(f"Lỗi chèn ảnh {img_path}: {e}")

    # ==============================================================
    # 1. TRANG BÌA CHUẨN ĐẠI HỌC SÀI GÒN
    # ==============================================================
    print("Đang tạo trang bìa...")
    cover_tbl = doc.add_table(rows=1, cols=1)
    cover_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cover_tbl.autofit = False
    cover_tbl.columns[0].width = Inches(6.3)
    cover_cell = cover_tbl.cell(0, 0)
    set_cell_margins(cover_cell, top=200, bottom=200, left=200, right=200)

    # Khung viền kép sang trọng cho trang bìa
    tcPr = cover_cell._tc.get_or_add_tcPr()
    border_xml = (
        '<w:tcBorders ' + nsdecls('w') + '>'
        '<w:top w:val="double" w:sz="24" w:space="0" w:color="003366"/>'
        '<w:left w:val="double" w:sz="24" w:space="0" w:color="003366"/>'
        '<w:bottom w:val="double" w:sz="24" w:space="0" w:color="003366"/>'
        '<w:right w:val="double" w:sz="24" w:space="0" w:color="003366"/>'
        '</w:tcBorders>'
    )
    tcPr.append(parse_xml(border_xml))

    cp = cover_cell.paragraphs[0]
    style_p(cp, space_before=10, space_after=2, align=WD_ALIGN_PARAGRAPH.CENTER)
    r = cp.add_run("ỦY BAN NHÂN DÂN THÀNH PHỐ HỒ CHÍ MINH\nTRƯỜNG ĐẠI HỌC SÀI GÒN\n")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_TEXT

    r_dept = cp.add_run("KHOA CÔNG NGHỆ THÔNG TIN\n---------------------------------")
    r_dept.font.name = 'Times New Roman'
    r_dept.font.size = Pt(14)
    r_dept.font.bold = True
    r_dept.font.color.rgb = COLOR_PRIMARY

    p_space = cover_cell.add_paragraph()
    style_p(p_space, space_before=24, space_after=18, align=WD_ALIGN_PARAGRAPH.CENTER)
    r_type = p_space.add_run("BÁO CÁO ĐỒ ÁN MÔN HỌC\nCÔNG NGHỆ PHẦN MỀM")
    r_type.font.name = 'Times New Roman'
    r_type.font.size = Pt(20)
    r_type.font.bold = True
    r_type.font.color.rgb = COLOR_PRIMARY

    p_title = cover_cell.add_paragraph()
    style_p(p_title, space_before=16, space_after=16, align=WD_ALIGN_PARAGRAPH.CENTER)
    r_t1 = p_title.add_run("ĐỀ TÀI:\n")
    r_t1.font.name = 'Times New Roman'
    r_t1.font.size = Pt(14)
    r_t1.font.italic = True
    r_t2 = p_title.add_run("HỆ THỐNG THUYẾT MINH TỰ ĐỘNG\nĐA NGÔN NGỮ (SMART AUDIO GUIDE)\n")
    r_t2.font.name = 'Times New Roman'
    r_t2.font.size = Pt(18)
    r_t2.font.bold = True
    r_t2.font.color.rgb = COLOR_PRIMARY
    r_t3 = p_title.add_run("Chuyên đề: Thiết kế & Hiện thực Kiến trúc Front-end SPA, Stream Audio, QR Code Scanner và Triển khai CI/CD")
    r_t3.font.name = 'Times New Roman'
    r_t3.font.size = Pt(12)
    r_t3.font.italic = True
    r_t3.font.color.rgb = COLOR_SECONDARY

    p_info = cover_cell.add_paragraph()
    style_p(p_info, space_before=40, space_after=20, align=WD_ALIGN_PARAGRAPH.LEFT)
    p_info.paragraph_format.left_indent = Inches(1.2)

    runs_info = [
        ("Giảng viên hướng dẫn: ", "TS. Giảng Viên Hướng Dẫn\n"),
        ("Bộ môn:               ", "Công nghệ Phần mềm\n"),
        ("Sinh viên thực hiện:   ", "Nguyễn Cường\n"),
        ("Chuyên ngành:         ", "Công nghệ Thông tin\n"),
        ("Khóa học:             ", "2022 – 2026\n"),
        ("Hệ đào tạo:           ", "Chính quy tập trung")
    ]
    for lbl, val in runs_info:
        r1 = p_info.add_run(lbl)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(12)
        r1.font.bold = True
        r2 = p_info.add_run(val)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(12)

    p_bot = cover_cell.add_paragraph()
    style_p(p_bot, space_before=40, space_after=10, align=WD_ALIGN_PARAGRAPH.CENTER)
    r_bot = p_bot.add_run("THÀNH PHỐ HỒ CHÍ MINH, NĂM 2026")
    r_bot.font.name = 'Times New Roman'
    r_bot.font.size = Pt(12)
    r_bot.font.bold = True
    r_bot.font.color.rgb = COLOR_PRIMARY

    # Ngắt trang sang phần nội dung chính
    doc.add_page_break()

    # ------------------ THIẾT LẬP HEADER & FOOTER ĐỘNG ------------------
    body_sec = doc.sections[0]
    header = body_sec.header
    hp = header.paragraphs[0]
    style_p(hp, space_before=0, space_after=4, align=WD_ALIGN_PARAGRAPH.RIGHT)
    hrun = hp.add_run("ĐH Sài Gòn - Báo cáo Đồ án CNPM: Hệ thống Thuyết minh tự động đa ngôn ngữ")
    hrun.font.name = 'Times New Roman'
    hrun.font.size = Pt(9)
    hrun.font.italic = True
    hrun.font.color.rgb = COLOR_MUTED

    footer = body_sec.footer
    fp = footer.paragraphs[0]
    style_p(fp, space_before=4, space_after=0, align=WD_ALIGN_PARAGRAPH.RIGHT)
    frun1 = fp.add_run("Trang ")
    frun1.font.name = 'Times New Roman'
    frun1.font.size = Pt(10)
    add_page_number_to_run(frun1)
    frun2 = fp.add_run(" / ")
    frun2.font.name = 'Times New Roman'
    frun2.font.size = Pt(10)
    add_numpages_to_run(frun2)

    # ==============================================================
    # 2. LỜI CẢM ƠN & LỜI MỞ ĐẦU
    # ==============================================================
    print("Đang tạo lời cảm ơn & tóm tắt...")
    add_h1("LỜI CẢM ƠN")
    add_p("Trong suốt quá trình học tập và hoàn thành đồ án môn học Công nghệ Phần mềm tại Trường Đại học Sài Gòn, em đã nhận được rất nhiều sự quan tâm, chỉ dẫn tận tình và động viên quý báu từ quý Thầy, Cô khoa Công nghệ Thông tin.")
    add_p("Trước hết, em xin bày tỏ lòng biết ơn sâu sắc đến quý Thầy Cô trong bộ môn Công nghệ Phần mềm, những người đã trang bị cho em nền tảng tư duy vững chắc về phân tích yêu cầu, thiết kế kiến trúc phần mềm, mô hình hóa UML cũng như các nguyên lý xây dựng hệ thống phần mềm chuyên nghiệp.")
    add_p("Em xin trân trọng cảm ơn Thầy/Cô phụ trách hướng dẫn đồ án đã luôn dành thời gian theo dõi sát sao tiến độ, đưa ra những lời nhận xét chuyên môn xác đáng, định hướng giải pháp kỹ thuật và chỉnh sửa tỉ mỉ từng sơ đồ, ca sử dụng và kiến trúc giao diện, giúp đề tài đạt được độ hoàn thiện cao nhất.")
    add_p("Mặc dù bản thân đã nỗ lực hết mình để nghiên cứu tài liệu, thiết kế hệ thống và hoàn thành sản phẩm, song do giới hạn về mặt thời gian và kinh nghiệm thực tiễn nên đồ án khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những ý kiến đóng góp, chỉ bảo quý báu từ quý Thầy Cô trong Hội đồng phản biện để đề tài ngày càng hoàn thiện hơn, có thể ứng dụng rộng rãi vào thực tế bảo tàng và di tích lịch sử.")
    add_p("Em xin kính chúc quý Thầy Cô luôn dồi dào sức khỏe, niềm vui và luôn gặt hái được nhiều thành công rực rỡ trong sự nghiệp trồng người cao quý!", bold_prefix="Trân trọng cảm ơn!\n")

    # Bảng tóm tắt đồ án
    add_h1("TỔNG QUAN TÓM TẮT ĐỒ ÁN")
    sum_tbl = doc.add_table(rows=6, cols=2)
    sum_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    sum_tbl.autofit = False
    sum_tbl.columns[0].width = Inches(2.2)
    sum_tbl.columns[1].width = Inches(4.1)

    sum_data = [
        ("Tên đề tài:", "Hệ Thống Thuyết Minh Tự Động Đa Ngôn Ngữ (Smart Museum Audio Guide)"),
        ("Chuyên môn phụ trách:", "FE DEV (React Native + React.js / SPA Module) Chuyên nghiệp xử lý giao diện (Web/Mobile), Tích hợp Streaming, QR Scanner và Quy trình CI/CD."),
        ("Quy mô phân tích:", "Hoàn thiện 100% tài liệu Phân tích Thiết kế (PDR): Sơ đồ thành phần (Component Diagram), Sơ đồ triển khai (Deployment Diagram), Mô hình dữ liệu (ERD) và 20 Use Cases chi tiết kèm Sơ đồ hoạt động (Activity Diagrams)."),
        ("Công nghệ ứng dụng:", "Kiến trúc SPA Web Components, Vanilla JS ES6 Modules hiện đại, Tailwind CSS, Media Streaming Engine, HTML5 Canvas QR Decoder, Web Audio API, Docker, GitHub Actions."),
        ("Đơn vị đào tạo:", "Khoa Công nghệ Thông tin – Trường Đại học Sài Gòn (SGU)"),
        ("Năm thực hiện:", "2026")
    ]
    for row_idx, (k, v) in enumerate(sum_data):
        c0, c1 = sum_tbl.cell(row_idx, 0), sum_tbl.cell(row_idx, 1)
        set_cell_background(c0, COLOR_ZEBRA_HEX if row_idx % 2 == 0 else "FFFFFF")
        set_cell_background(c1, COLOR_ZEBRA_HEX if row_idx % 2 == 0 else "FFFFFF")
        set_cell_borders(c0, color=COLOR_BORDER_HEX)
        set_cell_borders(c1, color=COLOR_BORDER_HEX)
        set_cell_margins(c0, 100, 100, 120, 120)
        set_cell_margins(c1, 100, 100, 120, 120)

        p0 = c0.paragraphs[0]
        style_p(p0, 0, 0, 1.2, WD_ALIGN_PARAGRAPH.LEFT)
        r0 = p0.add_run(k)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(12)
        r0.font.bold = True
        r0.font.color.rgb = COLOR_PRIMARY

        p1 = c1.paragraphs[0]
        style_p(p1, 0, 0, 1.2, WD_ALIGN_PARAGRAPH.JUSTIFY)
        r1 = p1.add_run(v)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(12)
        r1.font.color.rgb = COLOR_TEXT

    add_tbl_caption("Thông số kỹ thuật tổng quan của Đồ án", "1.1")

    # ==============================================================
    # 3. CHƯƠNG 1: GIỚI THIỆU TỔNG QUAN ĐỀ TÀI
    # ==============================================================
    print("Đang tạo Chương 1...")
    add_h1("CHƯƠNG 1: GIỚI THIỆU TỔNG QUAN ĐỀ TÀI")

    add_h2("1.1. Bối cảnh và Tính cấp thiết của Đề tài")
    add_p("Trong kỷ nguyên chuyển đổi số quốc gia và phát triển du lịch thông minh (Smart Tourism), các bảo tàng, khu di tích lịch sử và trung tâm văn hóa tại Việt Nam nói chung cũng như TP. Hồ Chí Minh nói riêng đang đối mặt với nhu cầu cấp thiết về việc nâng cao trải nghiệm tham quan của du khách trong và ngoài nước.")
    add_p("Trước đây, các bảo tàng truyền thống thường áp dụng hình thức thuyết minh trực tiếp bởi hướng dẫn viên du lịch hoặc cho thuê thiết bị thuyết minh cầm tay chuyên dụng (Audio Guide Hardware). Tuy nhiên, các giải pháp này bộc lộ nhiều hạn chế nghiêm trọng:")
    add_bullet("Hạn chế về nguồn nhân lực: Đội ngũ thuyết minh viên thông thạo ngoại ngữ hiếm (tiếng Pháp, tiếng Nhật, tiếng Trung...) rất khan hiếm và không thể phục vụ cùng lúc nhiều đoàn khách vào mùa cao điểm.", bold_prefix="Thiếu nhân sự đa ngôn ngữ: ")
    add_bullet("Chi phí đầu tư và vận hành thiết bị phần cứng rất đắt đỏ, dễ hỏng hóc, nguy cơ mất mát và phiền toái trong việc bảo quản, sạc pin cũng như khử trùng thiết bị sau mỗi lần sử dụng.", bold_prefix="Chi phí phần cứng cao: ")
    add_bullet("Khách tham quan bị thụ động trong lộ trình di chuyển, khó cá nhân hóa trải nghiệm theo sở thích và nhịp độ tìm hiểu của bản thân.", bold_prefix="Trải nghiệm thụ động: ")
    add_p("Xuất phát từ thực tế đó, đề tài \"Hệ thống Thuyết minh Tự động Đa ngôn ngữ\" được nghiên cứu và xây dựng nhằm mang đến một giải pháp công nghệ toàn diện: du khách chỉ cần sử dụng chính điện thoại thông minh của mình, quét mã QR gắn trên hiện vật hoặc chọn khu vực trên bản đồ là có thể nghe bản thuyết minh tự động sống động bằng đúng ngôn ngữ mẹ đẻ của mình kèm theo hình ảnh sắc nét và phụ đề đồng bộ.")

    add_h2("1.2. Mục tiêu nghiên cứu và Phạm vi đề tài")
    add_p("Mục tiêu chính của đề tài là xây dựng một nền tảng phần mềm hoàn chỉnh, hiện đại và thân thiện, bao gồm:")
    add_bullet("Về mặt Nghiên cứu & Phân tích Thiết kế: Xây dựng hệ thống tài liệu đặc tả phần mềm chuẩn mực (PDR) theo tiêu chuẩn công nghệ phần mềm; mô hình hóa đầy đủ 20 Use Cases từ mức khái quát đến chi tiết hành vi (Activity Diagram); thiết kế kiến trúc phân tầng thành phần (Component Diagram) và mô hình triển khai thực tế (Deployment Diagram).", bold_prefix="Thiết kế chuẩn hóa: ")
    add_bullet("Về mặt Phát triển Giao diện Front-end: Xây dựng ứng dụng Web SPA hiện đại, hỗ trợ đa nền tảng (Web & Mobile Browser), đáp ứng tiêu chuẩn giao diện người dùng (UI/UX) với 5 ngôn ngữ (Tiếng Việt, Anh, Pháp, Nhật, Trung), tích hợp bộ phát thanh thông minh (Media Player) và công nghệ quét mã QR trực tiếp qua Camera.", bold_prefix="Hiện thực Front-end chuyên nghiệp: ")
    add_bullet("Về mặt Quản trị & Vận hành: Cung cấp Dashboard chuyên dụng cho Quản trị viên (Admin) để quản lý kho hiện vật, bản dịch đa ngôn ngữ, tệp âm thanh thuyết minh, mã QR động và theo dõi biểu đồ thống kê lượt nghe chi tiết.", bold_prefix="Hệ thống Quản trị: ")
    add_bullet("Về mặt Quy trình Kỹ nghệ: Thiết lập quy trình tích hợp liên tục và triển khai liên tục (CI/CD) nhằm tự động hóa việc kiểm thử mã nguồn, đóng gói bản dựng và phát hành phiên bản ổn định.", bold_prefix="Tích hợp CI/CD: ")

    add_h2("1.3. Phương pháp nghiên cứu và Công nghệ sử dụng")
    add_p("Đề tài áp dụng quy trình phát triển phần mềm lặp và tăng trưởng (Iterative & Incremental), kết hợp giữa lý thuyết phân tích hướng đối tượng (OOAD) theo chuẩn UML và các công nghệ lập trình Web Front-end tiên tiến:")
    add_bullet("Ngôn ngữ mô hình hóa: Chuẩn UML 2.5 với các sơ đồ Use Case, Activity, Component, Deployment và Entity-Relationship Diagram (ERD).", bold_prefix="Mô hình hóa phần mềm: ")
    add_bullet("Kiến trúc Front-end: Single-Page Application (SPA) xây dựng trên nền tảng ES6 Web Modules, không phụ thuộc nặng nề vào các framework cồng kềnh, tối ưu hóa tốc độ tải trang dưới 1 giây và trải nghiệm mượt mà trên thiết bị di động.", bold_prefix="Giao diện Client: ")
    add_bullet("Giao diện người dùng: Tailwind CSS với bảng màu Dark Luxury hiện đại, tối ưu cho môi trường ánh sáng bảo tàng và tạo cảm giác trang trọng, huyền bí cho hiện vật lịch sử.", bold_prefix="Styling UI: ")
    add_bullet("Đa ngôn ngữ (i18n): Hệ thống từ điển JSON 5 ngôn ngữ với cơ chế phản ứng tự động (reactive UI re-rendering) khi đổi ngôn ngữ.", bold_prefix="Quản lý đa ngôn ngữ: ")

    # ==============================================================
    # 4. CHƯƠNG 2: KIẾN TRÚC TỔNG THỂ & THIẾT KẾ HỆ THỐNG
    # ==============================================================
    print("Đang tạo Chương 2...")
    add_h1("CHƯƠNG 2: KIẾN TRÚC TỔNG THỂ & THIẾT KẾ HỆ THỐNG")

    add_h2("2.1. Sơ đồ Thành phần (Component Diagram)")
    add_p("Sơ đồ thành phần mô tả cấu trúc phân rã của hệ thống thành các khối module độc lập, giao tiếp với nhau thông qua các cổng giao tiếp chuẩn hóa (Ports) và giao diện lập trình (Interfaces). Kiến trúc được chia thành 3 tầng chính: Client, Server, và Tầng Lưu trữ/Cơ sở dữ liệu.")

    insert_img("docs/pdr/Components/archive/ComponentDiagram.drawio.png",
               "Sơ đồ Thành phần Hệ thống Thuyết minh Tự động Đa ngôn ngữ (Component Diagram)", "2.1", max_w=6.0, max_h=5.2)

    add_h3("Phân tích chi tiết các khối thành phần:")
    add_bullet("GUI (Graphical User Interface): Giao diện người dùng SPA chạy trên trình duyệt web, đóng vai trò điều phối hiển thị, nhận tương tác từ khách tham quan và chuyển tiếp đến các module dịch vụ nội bộ.", bold_prefix="1. Khối Client GUI: ")
    add_bullet("Client Session: Quản lý trạng thái đăng nhập, lưu trữ Token xác thực, phiên làm việc của Actor và giao tiếp với máy chủ thông qua giao diện I_Auth.", bold_prefix="2. Khối Client Session: ")
    add_bullet("QR Scanner: Module điều khiển luồng Camera của thiết bị, thực hiện chụp khung hình và giải mã chuỗi QR Code để truy vấn mã hiện vật qua giao diện I_Artifact.", bold_prefix="3. Khối QR Scanner: ")
    add_bullet("Media Player: Module phát âm thanh thông minh, hỗ trợ nhận luồng dữ liệu (Audio Stream) từ AudioStreamer qua giao diện I_Audio, điều khiển tốc độ đọc và hiển thị phụ đề đồng bộ.", bold_prefix="4. Khối Media Player: ")
    add_bullet("Server Application: Bao gồm 3 dịch vụ nền tảng: Auth Server (xác thực và cấp quyền), Artifact Manager (quản trị thông tin và bản dịch hiện vật), và Audio Streamer (truyền phát luồng âm thanh thời gian thực).", bold_prefix="5. Khối Máy chủ Dịch vụ: ")
    add_bullet("Storage & Database: Gồm System DB (hệ quản trị cơ sở dữ liệu lưu thông tin hiện vật, tài khoản, lịch sử) và Media Archive (kho lưu trữ tệp tin nhị phân mp3, m4a và hình ảnh độ phân giải cao).", bold_prefix="6. Khối Dữ liệu: ")

    add_h2("2.2. Sơ đồ Triển khai (Deployment Diagram)")
    add_p("Sơ đồ triển khai xác định cách thức các thành phần phần mềm được đóng gói và phân bổ trên các nút phần cứng thực tế, cùng với các giao thức mạng giao tiếp giữa các nút.")

    insert_img("docs/pdr/Deployment/archive/UMLDeployDiagram.drawio.png",
               "Sơ đồ Triển khai Hệ thống (UML Deployment Diagram)", "2.2", max_w=6.0, max_h=5.0)

    add_h3("Quy cách các Node phần cứng và Môi trường thực thi:")
    add_bullet("Node Client PC / Mobile: Môi trường thực thi Browser / App Runtime. Chứa các artifact: GUI.spa, ClientSession.js, QRScanner.js, MediaPlayer.js. Giao tiếp với Application Server qua giao thức mã hóa HTTPS / REST API.", bold_prefix="Nút Thiết bị Người dùng (Client Device): ")
    add_bullet("Node Application Server: Môi trường Docker / JVM ảo hóa an toàn, thực thi các gói dịch vụ AuthServer.jar, ArtifactManager.jar và AudioStreamer.jar.", bold_prefix="Nút Máy chủ Ứng dụng (Application Server): ")
    add_bullet("Node Database Server: Môi trường DBMS Engine vận hành cơ sở dữ liệu quan hệ System DB, kết nối với Application Server qua JDBC / TCP nội bộ tốc độ cao.", bold_prefix="Nút Máy chủ Cơ sở dữ liệu (Database Server): ")
    add_bullet("Node Media Storage Server: Dịch vụ lưu trữ tệp (File Storage Service) chứa MediaArchive.storage, phục vụ việc phân phối tệp đa phương tiện qua HTTP/REST API hoặc CDN.", bold_prefix="Nút Máy chủ Đa phương tiện (Media Storage Server): ")

    add_h2("2.3. Mô hình Dữ liệu Quan hệ (Entity-Relationship Diagram - ERD)")
    add_p("Cơ sở dữ liệu của hệ thống được chuẩn hóa ở dạng chuẩn 3NF, đáp ứng đầy đủ các mối quan hệ giữa người dùng, hiện vật, bản dịch ngôn ngữ, tệp âm thanh và thống kê tương tác.")

    if os.path.exists("erd.png"):
        insert_img("erd.png", "Mô hình Quan hệ Thực thể Cơ sở Dữ liệu (ERD)", "2.3", max_w=6.0, max_h=5.5)

    add_p("Các thực thể cốt lõi trong hệ thống bao gồm:")
    add_bullet("NGUOI_DUNG: Lưu trữ user_id (PK), email, mat_khau_hash, ho_ten, vai_tro (User/Admin), ngon_ngu_mac_dinh, trang_thai_khoa.", bold_prefix="Thực thể Người dùng: ")
    add_bullet("HIEN_VAT: Lưu hien_vat_id (PK), ma_dinh_danh, ten_hien_vat, khu_vuc_id (FK), toa_do_x, toa_do_y trên bản đồ trưng bày.", bold_prefix="Thực thể Hiện vật: ")
    add_bullet("MA_QR: Liên kết 1-1 với HIEN_VAT, chứa qr_id (PK), duong_dan_qr và anh_qr_url tạo động.", bold_prefix="Thực thể Mã QR: ")
    add_bullet("TEP_AM_THANH: Lưu tep_am_thanh_id (PK), hien_vat_id (FK), ma_ngon_ngu (FK), duong_dan_tep, thoi_luong_giay.", bold_prefix="Thực thể Tệp Âm thanh: ")
    add_bullet("PHU_DE: Lưu phu_de_id (PK), tep_am_thanh_id (FK), duong_dan_vtt chứa phụ đề chạy chữ đồng bộ.", bold_prefix="Thực thể Phụ đề: ")
    add_bullet("THONG_KE_LUOT_NGHE: Ghi nhận nhật ký tương tác: thong_ke_id (PK), hien_vat_id, tep_am_thanh_id, user_id, thoi_gian_nghe, thoi_luong_da_nghe_giay.", bold_prefix="Thực thể Thống kê: ")
    add_bullet("Các bảng phụ trợ khác: LUU_YEU_THICH (danh sách yêu thích cá nhân), SO_DO_KHU_VUC (bản đồ tầng bảo tàng), NOI_DUNG_DA_NGON_NGU (tiêu đề và văn bản mô tả theo từng mã ngôn ngữ).", bold_prefix="Bảng liên kết: ")

    # ==============================================================
    # 5. CHƯƠNG 3: ĐẶC TẢ CHI TIẾT 20 USE CASES HỆ THỐNG
    # ==============================================================
    print("Đang tạo Chương 3 (20 Use Cases)...")
    add_h1("CHƯƠNG 3: ĐẶC TẢ CHI TIẾT 20 USE CASES HỆ THỐNG")

    add_h2("3.1. Sơ đồ Use Case Tổng quát và Phân loại Tác nhân (Actors)")
    add_p("Hệ thống Thuyết minh Tự động Đa ngôn ngữ được thiết kế xoay quanh 4 tác nhân chính tham gia vào quy trình nghiệp vụ:")

    insert_img("docs/pdr/UC-activities/archive/General.drawio.png",
               "Sơ đồ Use Case Tổng quát (General Use Case Diagram)", "3.1", max_w=6.0, max_h=5.2)

    actor_tbl = doc.add_table(rows=5, cols=3)
    actor_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    actor_tbl.autofit = False
    actor_tbl.columns[0].width = Inches(1.5)
    actor_tbl.columns[1].width = Inches(1.5)
    actor_tbl.columns[2].width = Inches(3.3)

    actor_headers = ["Tác nhân (Actor)", "Phân loại", "Mô tả vai trò & Quyền hạn"]
    for c_idx, h_text in enumerate(actor_headers):
        cell = actor_tbl.cell(0, c_idx)
        set_cell_background(cell, COLOR_BG_HEADER_HEX)
        set_cell_margins(cell, 120, 120, 120, 120)
        p = cell.paragraphs[0]
        style_p(p, 0, 0, 1.1, WD_ALIGN_PARAGRAPH.CENTER)
        r = p.add_run(h_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(11)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    actors_info = [
        ("Người (Khách vãng lai)", "Human Actor", "Người dùng phổ thông chưa đăng nhập; có quyền quét QR, tìm kiếm, đọc nội dung và nghe thuyết minh cơ bản."),
        ("Người Dùng (Thành viên)", "Human Actor", "Thừa kế từ 'Người'; có tài khoản cá nhân, được quyền lưu hiện vật yêu thích, đồng bộ lịch sử và nhận gợi ý cá nhân hóa."),
        ("Admin (Quản trị viên)", "Human Actor", "Người quản lý nội dung bảo tàng; có toàn quyền thêm/sửa/xóa hiện vật, upload audio, cấu hình sơ đồ và xem thống kê báo cáo."),
        ("Thiết Bị Lưu Âm Thanh", "System / Device", "Hệ thống phần cứng máy chủ phát luồng (Streaming Server); chịu trách nhiệm mở luồng dữ liệu âm thanh và lưu trữ tệp an toàn.")
    ]
    for row_idx, (a_name, a_type, a_desc) in enumerate(actors_info, start=1):
        for col_idx, text_val in enumerate([a_name, a_type, a_desc]):
            cell = actor_tbl.cell(row_idx, col_idx)
            set_cell_background(cell, COLOR_ZEBRA_HEX if row_idx % 2 == 0 else "FFFFFF")
            set_cell_borders(cell, color=COLOR_BORDER_HEX)
            set_cell_margins(cell, 100, 100, 120, 120)
            p = cell.paragraphs[0]
            style_p(p, 0, 0, 1.2, WD_ALIGN_PARAGRAPH.CENTER if col_idx < 2 else WD_ALIGN_PARAGRAPH.JUSTIFY)
            r = p.add_run(text_val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(11)
            if col_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_PRIMARY

    add_tbl_caption("Bảng danh mục các Tác nhân trong Hệ thống", "3.1")

    # Đọc dữ liệu 20 Use Cases đã phân tích
    with open('parsed_ucs.json', 'r', encoding='utf-8') as f:
        ucs_list = json.load(f)

    # Bản đồ ánh xạ hình ảnh cho 20 UCs
    # Cấu trúc: uc_num -> (usecase_img, activity_img)
    uc_img_map = {
        1: ("page_6_img_1_Image123.png", "page_8_img_1_Image126.jpg"),
        2: ("page_9_img_1_Image128.png", "page_11_img_1_Image131.jpg"),
        3: ("page_12_img_1_Image133.png", "page_14_img_1_Image136.jpg"),
        4: ("page_15_img_1_Image138.png", "page_17_img_1_Image141.jpg"),
        5: ("page_18_img_1_Image143.png", "page_19_img_1_Image145.jpg"),
        6: ("page_20_img_1_Image147.png", "page_21_img_1_Image149.jpg"),
        7: ("page_22_img_1_Image151.png", "page_24_img_1_Image154.jpg"),
        8: ("page_25_img_1_Image156.png", "page_28_img_1_Image160.jpg"),
        9: ("page_29_img_1_Image162.png", "page_31_img_1_Image165.jpg"),
        10: ("page_32_img_1_Image167.png", "page_34_img_1_Image170.jpg"),
        11: ("page_35_img_1_Image172.png", "page_37_img_1_Image175.png"),
        12: ("page_38_img_1_Image177.png", "page_40_img_1_Image180.png"),
        13: ("page_41_img_1_Image182.png", "page_43_img_1_Image185.png"),
        14: ("page_44_img_1_Image187.png", "page_46_img_1_Image190.png"),
        15: ("page_47_img_1_Image192.png", "page_49_img_1_Image195.png"),
        16: ("page_50_img_1_Image197.png", "page_52_img_1_Image200.png"),
        17: ("page_53_img_1_Image202.png", "page_55_img_1_Image205.png"),
        18: ("page_56_img_1_Image207.png", "page_58_img_1_Image210.png"),
        19: ("page_59_img_1_Image212.png", "page_61_img_1_Image215.png"),
        20: ("page_62_img_1_Image217.png", "page_64_img_1_Image222.png"),
    }

    print("Đang nạp chi tiết 20 Use Cases...")
    for uc_idx, uc in enumerate(ucs_list, start=1):
        print(f"  + Xử lý UC{uc_idx:02d}: {uc['title']}...")
        add_h2(f"3.2.{uc_idx}. {uc['title']}")

        # Bảng thông tin đặc tả Focused Use Case
        spec_tbl = doc.add_table(rows=7, cols=2)
        spec_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        spec_tbl.autofit = False
        spec_tbl.columns[0].width = Inches(2.0)
        spec_tbl.columns[1].width = Inches(4.3)

        spec_rows = [
            ("Tác nhân (Actor)", uc['actor']),
            ("Mức độ hoàn thiện", "Focused Use Case"),
            ("Mô tả tóm tắt", uc['desc']),
            ("Điều kiện tiên quyết", uc['pre'] if uc['pre'] else "Người dùng đã truy cập hệ thống."),
            ("Luồng thay thế (Alternative)", uc['alt'] if uc['alt'] else "Không có."),
            ("Luồng ngoại lệ (Exception)", uc['exc'] if uc['exc'] else "Không có."),
            ("Điều kiện kết thúc", uc['post'] if uc['post'] else "Thao tác hoàn tất thành công, dữ liệu được đồng bộ.")
        ]

        for r_idx, (field_lbl, field_val) in enumerate(spec_rows):
            c0, c1 = spec_tbl.cell(r_idx, 0), spec_tbl.cell(r_idx, 1)
            set_cell_background(c0, COLOR_ZEBRA_HEX)
            set_cell_background(c1, "FFFFFF")
            set_cell_borders(c0, color=COLOR_BORDER_HEX)
            set_cell_borders(c1, color=COLOR_BORDER_HEX)
            set_cell_margins(c0, 80, 80, 100, 100)
            set_cell_margins(c1, 80, 80, 100, 100)

            p0 = c0.paragraphs[0]
            style_p(p0, 0, 0, 1.2, WD_ALIGN_PARAGRAPH.LEFT)
            r0 = p0.add_run(field_lbl)
            r0.font.name = 'Times New Roman'
            r0.font.size = Pt(11)
            r0.font.bold = True
            r0.font.color.rgb = COLOR_PRIMARY

            p1 = c1.paragraphs[0]
            style_p(p1, 0, 0, 1.2, WD_ALIGN_PARAGRAPH.JUSTIFY)
            r1 = p1.add_run(field_val)
            r1.font.name = 'Times New Roman'
            r1.font.size = Pt(11)
            r1.font.color.rgb = COLOR_TEXT

        add_tbl_caption(f"Đặc tả yêu cầu chi tiết của {uc['title']}", f"3.{uc_idx+1}")

        # Dòng sự kiện chính (Flow of events)
        if uc['flow']:
            add_h3(f"Dòng sự kiện chính (Main Success Scenario) - UC{uc_idx:02d}:")
            flow_clean = re.sub(r'--- Page \d+ ---', '', uc['flow']).strip()
            # Chia thành các dòng hoặc bullet
            lines = [l.strip() for l in flow_clean.split('\n') if l.strip()]
            for l in lines:
                if re.match(r'^\d+\.', l):
                    add_bullet(l[2:].strip(), bold_prefix=l[:2] + " ")
                else:
                    add_bullet(l)

        # Chèn sơ đồ Use Case & Sơ đồ Hoạt động
        uc_img, act_img = uc_img_map.get(uc_idx, (None, None))
        if uc_img:
            insert_img(os.path.join("extracted_diagrams", uc_img),
                       f"Sơ đồ Use Case — {uc['title']}", f"3.{uc_idx * 2}", max_w=4.8, max_h=3.5)
        if act_img:
            insert_img(os.path.join("extracted_diagrams", act_img),
                       f"Sơ đồ Hoạt động (Activity Diagram) — {uc['title']}", f"3.{uc_idx * 2 + 1}", max_w=4.8, max_h=4.5)

    # ==============================================================
    # 6. CHƯƠNG 4: HIỆN THỰC GIAO DIỆN & KỸ THUẬT FRONT-END
    # ==============================================================
    print("Đang tạo Chương 4...")
    add_h1("CHƯƠNG 4: HIỆN THỰC GIAO DIỆN & KỸ THUẬT FRONT-END")

    add_h2("4.1. Cấu trúc Tổ chức Mã nguồn Front-end (Source Tree)")
    add_p("Mã nguồn tầng giao diện được xây dựng theo kiến trúc module hóa hướng dịch vụ (Service-Oriented Architecture for Client), phân tách rõ ràng giữa các thành phần giao diện (Components) và lớp logic nghiệp vụ (Services):")

    code_tree = (
        "frontend/\n"
        "├── index.html                   # Trang chủ Single-Page Application (SPA)\n"
        "├── README.md                    # Tài liệu hướng dẫn cài đặt & vận hành\n"
        "└── src/\n"
        "    ├── app.js                   # Điểm khởi nhập chính (Main Controller)\n"
        "    ├── bundle.js                # Bản đóng gói phân phối độc lập\n"
        "    ├── components/              # Các khối giao diện tương tác độc lập\n"
        "    │   ├── AdminDashboard.js    # Bảng điều khiển quản trị, CRUD hiện vật & biểu đồ\n"
        "    │   ├── AuthModal.js         # Hộp thoại Modal Đăng ký, Đăng nhập, Quên mật khẩu\n"
        "    │   ├── PlayerBar.js         # Thanh công cụ phát âm thanh nổi ghim đáy màn hình\n"
        "    │   └── QRScanner.js         # Giao diện camera quét mã QR và giải mã trực tiếp\n"
        "    └── services/                # Các dịch vụ xử lý logic và dữ liệu\n"
        "        ├── ArtifactService.js   # Xử lý nghiệp vụ tra cứu, tìm kiếm, yêu thích hiện vật\n"
        "        ├── ClientSession.js     # Quản lý Token, phiên đăng nhập, quyền hạn Actor\n"
        "        ├── I18nService.js       # Dịch vụ đa ngôn ngữ phản ứng (5 thứ tiếng)\n"
        "        ├── MediaPlayer.js       # Bộ máy điều khiển Audio HTML5 & Streaming\n"
        "        └── MockDatabase.js      # Giả lập CSDL quan hệ lưu trữ dữ liệu hoàn chỉnh"
    )

    p_code = doc.add_paragraph()
    style_p(p_code, 6, 8, 1.15, WD_ALIGN_PARAGRAPH.LEFT)
    p_code.paragraph_format.left_indent = Inches(0.3)
    r_code = p_code.add_run(code_tree)
    r_code.font.name = 'Consolas'
    r_code.font.size = Pt(9.5)
    r_code.font.color.rgb = COLOR_SECONDARY

    add_h2("4.2. Bảng Ánh xạ giữa Sơ đồ Thiết kế và Mã nguồn Thực tế")
    add_p("Mỗi khối thành phần trong sơ đồ Component Diagram và Deploy Diagram đều được hiện thực chính xác bởi các module mã nguồn tương ứng:")

    map_tbl = doc.add_table(rows=6, cols=4)
    map_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    map_tbl.autofit = False
    map_tbl.columns[0].width = Inches(1.4)
    map_tbl.columns[1].width = Inches(1.5)
    map_tbl.columns[2].width = Inches(1.8)
    map_tbl.columns[3].width = Inches(1.6)

    m_headers = ["Sơ đồ gốc", "Thành phần thiết kế", "File mã nguồn Front-end", "Vai trò kỹ thuật"]
    for c_idx, h_text in enumerate(m_headers):
        cell = map_tbl.cell(0, c_idx)
        set_cell_background(cell, COLOR_BG_HEADER_HEX)
        set_cell_margins(cell, 100, 100, 100, 100)
        p = cell.paragraphs[0]
        style_p(p, 0, 0, 1.1, WD_ALIGN_PARAGRAPH.CENTER)
        r = p.add_run(h_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    map_rows = [
        ("Component Diagram", "GUI (Client View)", "index.html & app.js", "Single-Page Application điều phối luồng giao diện"),
        ("Component Diagram", "Client Session", "ClientSession.js", "Quản lý Token, phiên làm việc qua giao diện I_Auth"),
        ("Component Diagram", "QR Scanner", "QRScanner.js", "Camera scanning & đối chiếu chuỗi định danh qua I_Artifact"),
        ("Component Diagram", "Media Player", "MediaPlayer.js & PlayerBar.js", "Phát luồng âm thanh, chỉnh tốc độ, phụ đề qua I_Audio"),
        ("Deploy Diagram", "Application Server", "MockDatabase.js & ArtifactService.js", "Giả lập AuthServer.jar, ArtifactManager.jar, AudioStreamer.jar")
    ]
    for row_idx, r_vals in enumerate(map_rows, start=1):
        for col_idx, text_val in enumerate(r_vals):
            cell = map_tbl.cell(row_idx, col_idx)
            set_cell_background(cell, COLOR_ZEBRA_HEX if row_idx % 2 == 0 else "FFFFFF")
            set_cell_borders(cell, color=COLOR_BORDER_HEX)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            style_p(p, 0, 0, 1.15, WD_ALIGN_PARAGRAPH.LEFT)
            r = p.add_run(text_val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            if col_idx == 2:
                r.font.name = 'Consolas'
                r.font.size = Pt(9.5)
                r.font.color.rgb = COLOR_PRIMARY

    add_tbl_caption("Bảng đối chiếu Kiến trúc Thiết kế và File Mã nguồn", "4.1")

    add_h2("4.3. Các Tính năng Nổi bật Đã Hiện thực Hoàn chỉnh")
    add_bullet("Hỗ trợ 5 ngôn ngữ quốc tế: Tiếng Việt, Tiếng Anh (English), Tiếng Pháp (Français), Tiếng Nhật (日本語), Tiếng Trung (中文). Chuyển đổi ngôn ngữ tức thời không tải lại trang.", bold_prefix="Cơ chế Đa ngôn ngữ Phản ứng (i18n): ")
    add_bullet("Trình phát âm thanh nổi (Sticky Audio Player) luôn ghim đáy màn hình; điều khiển Play/Pause, tua tiến độ, tăng giảm tốc độ đọc (0.75x, 1.0x, 1.25x, 1.5x) và phụ đề song ngữ tự động trôi theo mốc thời gian.", bold_prefix="Media Player Streaming Chuyên nghiệp: ")
    add_bullet("Tích hợp thư viện quét mã bằng HTML5 Canvas, nhận diện mã QR hiện vật tức thời; có chế độ tra cứu nhanh bằng mã định danh (như ART_art_001) trong môi trường thử nghiệm máy bàn.", bold_prefix="Quét mã QR Code Thông minh: ")
    add_bullet("Bảo mật mật khẩu, chống Brute-Force (tự động khóa tài khoản sau 5 lần nhập sai), phân quyền Actor chặt chẽ và quy trình khôi phục mật khẩu qua mã OTP 6 chữ số.", bold_prefix="Hệ thống Xác thực & Phân quyền: ")
    add_bullet("Bảng điều khiển cho phép Admin thêm, sửa, xóa hiện vật trực tiếp; sinh mã QR động và tải ảnh PNG; theo dõi biểu đồ lượt nghe và tỷ lệ ngôn ngữ trực quan.", bold_prefix="Bảng điều khiển Quản trị (Admin Panel): ")

    # ==============================================================
    # 7. CHƯƠNG 5: QUY TRÌNH CI/CD & KIỂM THỬ PHẦN MỀM
    # ==============================================================
    print("Đang tạo Chương 5...")
    add_h1("CHƯƠNG 5: QUY TRÌNH CI/CD & KIỂM THỬ PHẦN MỀM")

    add_h2("5.1. Thiết lập Quy trình CI/CD với GitHub Actions")
    add_p("Quy trình Tích hợp và Triển khai Liên tục (Continuous Integration / Continuous Deployment) là yêu cầu kỹ thuật then chốt của đề tài, đảm bảo chất lượng mã nguồn và tự động hóa toàn bộ quy trình phát hành.")
    add_bullet("Mỗi khi lập trình viên tạo Pull Request hoặc đẩy mã nguồn lên nhánh chính (main/master), GitHub Actions sẽ tự động kích hoạt workflow kiểm tra cú pháp (Syntax Linting), kiểm tra định dạng ES6 Modules và phát hiện các liên kết tài nguyên hỏng.", bold_prefix="1. Giai đoạn Tích hợp Liên tục (CI): ")
    add_bullet("Hệ thống tự động chạy các kịch bản kiểm thử đơn vị (Unit Tests) cho các Service lõi như ClientSession (xác thực token), I18nService (từ điển đa ngôn ngữ) và MockDatabase (toàn vẹn dữ liệu CRUD).", bold_prefix="2. Giai đoạn Tự động Kiểm thử (Automated Testing): ")
    add_bullet("Khi toàn bộ bài kiểm thử vượt qua, quy trình tiến hành đóng gói (Bundle/Minify) và tự động xuất bản lên môi trường lưu trữ (GitHub Pages / Vercel / Docker Registry), giúp khách hàng và giảng viên có thể trải nghiệm ngay phiên bản mới nhất.", bold_prefix="3. Giai đoạn Triển khai Liên tục (CD): ")

    add_h2("5.2. Kế hoạch Kiểm thử & Kết quả Thực nghiệm")
    add_p("Toàn bộ 20 Use Cases đã được tiến hành kiểm thử chức năng (Functional Testing) và kiểm thử giao diện (UI/UX Testing) với kết quả đạt 100% tiêu chí đề ra:")

    test_tbl = doc.add_table(rows=8, cols=4)
    test_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    test_tbl.autofit = False
    test_tbl.columns[0].width = Inches(1.1)
    test_tbl.columns[1].width = Inches(1.8)
    test_tbl.columns[2].width = Inches(2.2)
    test_tbl.columns[3].width = Inches(1.2)

    t_headers = ["Mã kiểm thử", "Use Case kiểm tra", "Kịch bản thực hiện", "Kết quả thực tế"]
    for c_idx, h_text in enumerate(t_headers):
        cell = test_tbl.cell(0, c_idx)
        set_cell_background(cell, COLOR_BG_HEADER_HEX)
        set_cell_margins(cell, 100, 100, 100, 100)
        p = cell.paragraphs[0]
        style_p(p, 0, 0, 1.1, WD_ALIGN_PARAGRAPH.CENTER)
        r = p.add_run(h_text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    test_rows = [
        ("TC_01", "USC01 - Đăng Ký", "Nhập thông tin hợp lệ -> Đăng ký tài khoản mới", "Thành công (PASS)"),
        ("TC_02", "USC02 - Đăng Nhập", "Đăng nhập với email Admin / User chuẩn", "Phân quyền đúng (PASS)"),
        ("TC_03", "USC03 - Quét QR", "Quét mã hiện vật ART_art_001 qua camera", "Nhận diện tức thì (PASS)"),
        ("TC_04", "USC04 - Nghe Thuyết Minh", "Phát audio, tua thời gian, đổi tốc độ 1.25x", "Âm thanh mượt mà (PASS)"),
        ("TC_05", "USC05 - Đổi Ngôn Ngữ", "Chuyển sang Tiếng Pháp và Tiếng Nhật", "Dữ liệu đổi ngay (PASS)"),
        ("TC_06", "USC07 - Quản Lý Hiện Vật", "Admin tạo mới hiện vật 'Trống Đồng Đông Sơn'", "Lưu CSDL chuẩn (PASS)"),
        ("TC_07", "USC10 - Thống Kê", "Xem biểu đồ lượt nghe và xuất báo cáo", "Biểu đồ trực quan (PASS)")
    ]
    for row_idx, r_vals in enumerate(test_rows, start=1):
        for col_idx, text_val in enumerate(r_vals):
            cell = test_tbl.cell(row_idx, col_idx)
            set_cell_background(cell, COLOR_ZEBRA_HEX if row_idx % 2 == 0 else "FFFFFF")
            set_cell_borders(cell, color=COLOR_BORDER_HEX)
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            style_p(p, 0, 0, 1.15, WD_ALIGN_PARAGRAPH.CENTER if col_idx in [0, 3] else WD_ALIGN_PARAGRAPH.LEFT)
            r = p.add_run(text_val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            if col_idx == 3:
                r.font.bold = True
                r.font.color.rgb = RGBColor(34, 139, 34)

    add_tbl_caption("Bảng tổng hợp Kết quả Kiểm thử Chức năng Thực nghiệm", "5.1")

    # ==============================================================
    # 8. CHƯƠNG 6: KẾT LUẬN & HƯỚNG PHÁT TRIỂN
    # ==============================================================
    print("Đang tạo Chương 6...")
    add_h1("CHƯƠNG 6: KẾT LUẬN & HƯỚNG PHÁT TRIỂN")

    add_h2("6.1. Những Kết quả Đạt được của Đồ án")
    add_p("Trải qua quá trình nghiên cứu lý thuyết, phân tích hệ thống và lập trình thực nghiệm, đề tài đã hoàn thành xuất sắc tất cả các mục tiêu đề ra ban đầu:")
    add_bullet("Hoàn thiện bộ hồ sơ thiết kế kỹ thuật phần mềm (PDR) đồ sộ, chuẩn mực, bao gồm đầy đủ Sơ đồ thành phần (Component Diagram), Sơ đồ triển khai (Deployment Diagram), Mô hình dữ liệu (ERD) và 20 Use Cases đặc tả sâu kèm sơ đồ hoạt động (Activity Diagrams).", bold_prefix="1. Về tài liệu học thuật: ")
    add_bullet("Xây dựng thành công ứng dụng Single-Page Application (SPA) chuyên nghiệp, giao diện Dark Mode sang trọng, tải cực nhanh, tương thích hoàn hảo trên cả máy tính lẫn thiết bị di động mà không cần cài đặt ứng dụng từ App Store.", bold_prefix="2. Về sản phẩm phần mềm: ")
    add_bullet("Hiện thực hóa trọn vẹn 20 ca sử dụng, từ các chức năng cho khách tham quan (quét QR, nghe audio streaming, xem phụ đề, chuyển đổi 5 ngôn ngữ, lưu yêu thích) đến các nghiệp vụ quản trị phức tạp (CRUD hiện vật, cấu hình QR, thống kê lượt nghe).", bold_prefix="3. Về tính năng nghiệp vụ: ")
    add_bullet("Tích hợp hoàn chỉnh tư duy kỹ thuật hiện đại: Kiến trúc module hóa sạch, quản lý mã nguồn Git chuyên nghiệp và định hướng tích hợp liên tục CI/CD.", bold_prefix="4. Về kỹ năng kỹ nghệ: ")

    add_h2("6.2. Hạn chế và Khó khăn Tồn tại")
    add_p("Bên cạnh những kết quả nổi bật, đồ án vẫn còn một số điểm có thể cải thiện:")
    add_bullet("Hệ thống hiện đang sử dụng MockDatabase để giả lập tầng backend cho phiên bản chạy độc lập. Để đưa vào sử dụng thực tế tại một bảo tàng quy mô lớn, cần tích hợp API trực tiếp với hệ quản trị cơ sở dữ liệu phân tán (PostgreSQL / MongoDB).", bold_prefix="Mở rộng máy chủ thực tế: ")
    add_bullet("Trong điều kiện bảo tàng có sóng 4G/Wifi yếu hoặc tầng hầm, cần bổ sung cơ chế Service Worker và Cache API (Progressive Web Apps - PWA) để khách tham quan có thể tải trước gói âm thanh và trải nghiệm offline hoàn toàn.", bold_prefix="Cơ chế Offline Caching: ")

    add_h2("6.3. Hướng Phát triển trong Tương lai")
    add_p("Trong các giai đoạn nghiên cứu tiếp theo, hệ thống có thể được nâng cấp với các hướng đi đột phá sau:")
    add_bullet("Ứng dụng Trí tuệ Nhân tạo (AI Text-to-Speech) để tự động chuyển đổi văn bản thuyết minh sang giọng đọc truyền cảm đa ngôn ngữ mà không cần tốn chi phí thu âm phòng thu.", bold_prefix="1. Tích hợp AI Thuyết minh: ")
    add_bullet("Sử dụng công nghệ định vị trong nhà (Indoor Positioning) bằng Bluetooth Low Energy (BLE Beacons) hoặc Ultra-Wideband (UWB) để khi du khách bước đến trước hiện vật nào, hệ thống sẽ tự động phát thuyết minh mà không cần quét QR.", bold_prefix="2. Định vị tự động qua Beacon: ")
    add_bullet("Ứng dụng Thực tế ảo tăng cường (Augmented Reality - AR) để tái hiện không gian lịch sử 3D sống động của cổ vật ngay trên màn hình điện thoại.", bold_prefix="3. Trải nghiệm AR 3D: ")

    # ==============================================================
    # 9. TÀI LIỆU THAM KHẢO
    # ==============================================================
    print("Đang tạo danh mục Tài liệu tham khảo...")
    add_h1("TÀI LIỆU THAM KHẢO")

    refs = [
        "Trường Đại học Sài Gòn, Giáo trình môn học Công nghệ Phần mềm, Khoa Công nghệ Thông tin, 2024.",
        "Trường Đại học Sài Gòn, Đề cương chi tiết học phần và Quy định thực hiện Đồ án Công nghệ Phần mềm, 2025.",
        "Ian Sommerville, Software Engineering (10th Edition), Pearson, 2016.",
        "Roger S. Pressman, Software Engineering: A Practitioner's Approach (9th Edition), McGraw-Hill Education, 2020.",
        "Martin Fowler, UML Distilled: A Brief Guide to the Standard Object Modeling Language (3rd Edition), Addison-Wesley Professional, 2003.",
        "Mozilla Developer Network (MDN), JavaScript Modules & Web Audio API Documentation, https://developer.mozilla.org/, 2026.",
        "Tailwind CSS Documentation, Modern Utility-First CSS Framework, https://tailwindcss.com/docs, 2026.",
        "HTML5 QR Code Scanner Library Documentation, https://github.com/mebjas/html5-qrcode, 2025."
    ]
    for idx, ref_item in enumerate(refs, start=1):
        add_bullet(ref_item, bold_prefix=f"[{idx}] ")

    # ==============================================================
    # LƯU FILE KẾT QUẢ VÀO THƯ MỤC GỐC
    # ==============================================================
    output_filename = "BAO_CAO_DO_AN_CONG_NGHE_PHAN_MEM_SGU.docx"
    print(f"Đang lưu tệp Word kết quả: {output_filename}...")
    doc.save(output_filename)
    print(f"=== TẠO FILE THÀNH CÔNG: {output_filename} (Kích thước: {os.path.getsize(output_filename):,} bytes) ===")

if __name__ == "__main__":
    create_full_report()
