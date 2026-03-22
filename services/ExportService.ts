import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import pptxgen from 'pptxgenjs';
import { saveAs } from 'file-saver';
import { Message, Sender } from '../types';

export const exportToDocx = async (messages: Message[], subjectName: string) => {
    try {
        const docChildren: any[] = [
            new Paragraph({
                text: `Hồ Sơ Giảng Dạy - ${subjectName}`,
                heading: HeadingLevel.TITLE,
                alignment: AlignmentType.CENTER,
                spacing: { after: 300 },
            }),
            new Paragraph({
                text: `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}`,
                alignment: AlignmentType.CENTER,
                spacing: { after: 500 },
            }),
        ];

        messages.forEach(msg => {
            const isUser = msg.sender === Sender.User;
            const senderName = isUser ? '👨‍🏫 Giáo Viên' : '🤖 Trợ Lý AI';
            const color = isUser ? "2E7D32" : "1565C0";

            // Add sender header
            docChildren.push(
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${senderName}:`,
                            bold: true,
                            color: color,
                            size: 26,
                        })
                    ],
                    spacing: { before: 400, after: 150 },
                    border: {
                        bottom: { color: color, space: 1, size: 6, style: 'single' }
                    }
                })
            );

            // Split message text by newlines and create separate paragraphs
            const lines = msg.text.split('\n');
            lines.forEach((line, idx) => {
                const trimmedLine = line.trim();

                // Skip empty lines but add spacing
                if (!trimmedLine) {
                    docChildren.push(new Paragraph({ text: '', spacing: { after: 100 } }));
                    return;
                }

                // Check if it's a heading (starts with # or **)
                const isHeading = trimmedLine.startsWith('#') || (trimmedLine.startsWith('**') && trimmedLine.endsWith('**'));
                const isBullet = trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || /^\d+\./.test(trimmedLine);

                let cleanText = trimmedLine
                    .replace(/^#+\s*/, '')  // Remove markdown headings
                    .replace(/^\*\*|\*\*$/g, '') // Remove bold markers
                    .replace(/^[-•]\s*/, '') // Remove bullet markers
                    .replace(/^\d+\.\s*/, ''); // Remove numbered list markers

                if (isHeading) {
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: cleanText,
                                    bold: true,
                                    size: 24,
                                    color: '333333'
                                })
                            ],
                            spacing: { before: 200, after: 100 },
                        })
                    );
                } else if (isBullet) {
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `• ${cleanText}`,
                                    size: 22,
                                })
                            ],
                            spacing: { after: 80 },
                            indent: { left: 720 }, // 0.5 inch indent
                        })
                    );
                } else {
                    docChildren.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: cleanText,
                                    size: 22,
                                })
                            ],
                            spacing: { after: 120 },
                        })
                    );
                }
            });

            // Add separator after each message
            docChildren.push(new Paragraph({ text: '', spacing: { after: 300 } }));
        });

        const doc = new Document({
            sections: [{
                properties: {},
                children: docChildren,
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Giao_An_${subjectName}_${Date.now()}.docx`);
        return true;
    } catch (error) {
        console.error("Export DOCX Error:", error);
        return false;
    }
};

export const exportToPptx = async (messages: Message[], subjectName: string) => {
    try {
        const pres = new pptxgen();

        // Set Metadata
        pres.author = 'STEM Expert AI';
        pres.company = 'STEM EdTech';
        pres.subject = subjectName;
        pres.title = `Bài Giảng: ${subjectName}`;

        // Master Slide
        pres.defineSlideMaster({
            title: 'MASTER_SLIDE',
            background: { color: 'FFFFFF' },
            objects: [
                { rect: { x: 0, y: 6.9, w: '100%', h: 0.6, fill: { color: '003366' } } },
                { text: { text: 'STEM Expert AI', options: { x: 0.5, y: 7.05, w: 5, h: 0.3, fontFace: 'Arial', fontSize: 12, color: 'FFFFFF' } } },
                { slideNumber: { x: 9.0, y: 7.05, color: 'FFFFFF', fontSize: 12 } },
            ],
        });

        // Title Slide
        const titleSlide = pres.addSlide({ masterName: 'MASTER_SLIDE' });
        titleSlide.addText(`Bài Giảng: ${subjectName}`, { x: 1, y: 2, w: 8, h: 1.5, fontSize: 36, color: '003366', align: 'center', bold: true });
        titleSlide.addText(`Ngày: ${new Date().toLocaleDateString('vi-VN')}`, { x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 18, color: '666666', align: 'center' });

        // Content Slides (Filter for Bot messages only mostly, or conversation)
        // Basic logic: Each bot message is a slide (or split if too long)
        messages.filter(m => m.sender === Sender.Bot && !m.isLoading).forEach((msg, index) => {
            const slide = pres.addSlide({ masterName: 'MASTER_SLIDE' });

            // Attempt to extract title from markdown # or FIRST line
            const lines = msg.text.split('\n');
            let title = `Nội Dung ${index + 1}`;
            let content = msg.text;

            // Simple heuristic for title
            if (lines[0].startsWith('#') || lines[0].startsWith('**')) {
                title = lines[0].replace(/^[#*]+/, '').trim();
                content = lines.slice(1).join('\n').trim();
            } else if (lines[0].length < 50) {
                title = lines[0];
                content = lines.slice(1).join('\n').trim();
            }

            // Truncate title
            if (title.length > 60) title = title.substring(0, 57) + '...';

            slide.addText(title, { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 24, color: '003366', bold: true });

            // Add content text box
            slide.addText(content, {
                x: 0.5, y: 1.5, w: 9, h: 5.0,
                fontSize: 14, color: '333333',
                valign: 'top',
                wrap: true,
                fontFace: 'Arial'
            });
        });

        await pres.writeFile({ fileName: `Bai_Giang_${subjectName}_${Date.now()}.pptx` });
        return true;
    } catch (error) {
        console.error("Export PPTX Error:", error);
        return false;
    }
};
