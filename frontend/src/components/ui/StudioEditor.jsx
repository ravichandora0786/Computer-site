import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { httpRequest, endPoints } from "../../request";
import { toast } from 'react-toastify';

/**
 * Official Quill 2.0.3 Studio Editor 
 * Final Pro Version: Native Color Selection, Resizing Stability & Auto-Cleanup
 */
const StudioEditor = ({ value, onChange, placeholder = 'Start building your content...', height = '500px', isSaved = false }) => {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const colorInputRef = useRef(null);
  const activeFormatRef = useRef(null); // 'color' or 'background'
  const sessionFilesRef = useRef([]); // Track files uploaded in THIS session
  const lastEmittedValueRef = useRef(''); // Track what we LAST sent to parent to avoid loops

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      
      const Align = Quill.import('formats/align');
      Quill.register(Align, true);
      
      // --- CUSTOM LOCAL VIDEO BLOT ---
      const Embed = Quill.import('blots/embed');
      class LocalVideoBlot extends Embed {
        static create(value) {
          const node = super.create();
          node.setAttribute('src', value);
          node.setAttribute('controls', true);
          node.setAttribute('controlsList', 'nodownload');
          node.style.borderRadius = '12px';
          node.style.display = 'inline-block';
          node.style.maxWidth = '100%';
          node.style.margin = '5px';
          node.style.verticalAlign = 'middle';
          return node;
        }
        static value(node) { return node.getAttribute('src'); }
        static formats(node) {
          return {
            width: node.getAttribute('width'),
            height: node.getAttribute('height')
          };
        }
        format(name, value) {
          if (name === 'width' || name === 'height') {
            if (value) {
              this.domNode.setAttribute(name, value);
              this.domNode.style[name] = value + 'px';
            } else {
              this.domNode.removeAttribute(name);
              this.domNode.style[name] = '';
            }
          } else {
            super.format(name, value);
          }
        }
      }
      LocalVideoBlot.blotName = 'localVideo';
      LocalVideoBlot.tagName = 'video';
      Quill.register(LocalVideoBlot);

      class MediaResizer {
        constructor(quill) {
          this.quill = quill;
          this.container = quill.root;
          this.overlay = null;
          this.selectedMedia = null;
          this.handleSize = 8;
          
          this.quill.root.addEventListener('click', (e) => this.handleClick(e));
          this.quill.root.parentNode.style.position = 'relative';
          
          this.quill.on('scroll-optimize', () => this.positionOverlay());
          window.addEventListener('resize', () => {
            this.positionOverlay();
            if (!this.selectedMedia) this.hideOverlay();
          });
        }

        handleClick(e) {
          if (e.target && (e.target.tagName === 'IMG' || e.target.tagName === 'IFRAME' || e.target.tagName === 'VIDEO')) {
            this.showOverlay(e.target);
          } else {
            this.hideOverlay();
          }
        }

        showOverlay(media) {
          if (this.selectedMedia === media) return;
          this.hideOverlay();
          this.selectedMedia = media;

          this.overlay = document.createElement('div');
          this.overlay.className = 'studio-media-overlay';
          Object.assign(this.overlay.style, {
            position: 'absolute', border: '2px solid #FF4D2D', boxSizing: 'border-box', zIndex: '100', pointerEvents: 'none',
          });

          this.container.parentNode.appendChild(this.overlay);
          this.positionOverlay();
          this.addHandles();
        }

        hideOverlay() {
          if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
          }
          this.selectedMedia = null;
        }

        positionOverlay() {
          if (!this.selectedMedia || !this.overlay) return;
          const rect = this.selectedMedia.getBoundingClientRect();
          const containerRect = this.container.parentNode.getBoundingClientRect();

          Object.assign(this.overlay.style, {
            left: `${rect.left - containerRect.left}px`,
            top: `${rect.top - containerRect.top + this.container.parentNode.scrollTop}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          });
        }

        addHandles() {
          ['nw', 'ne', 'sw', 'se'].forEach(pos => {
            const handle = document.createElement('div');
            Object.assign(handle.style, {
              width: `${this.handleSize}px`, height: `${this.handleSize}px`,
              background: '#FF4D2D', position: 'absolute', pointerEvents: 'auto',
              cursor: `${pos}-resize`, borderRadius: '50%', border: '1px solid white',
            });
            if (pos.includes('n')) handle.style.top = `-${this.handleSize / 2}px`;
            if (pos.includes('s')) handle.style.bottom = `-${this.handleSize / 2}px`;
            if (pos.includes('w')) handle.style.left = `-${this.handleSize / 2}px`;
            if (pos.includes('e')) handle.style.right = `-${this.handleSize / 2}px`;

            handle.addEventListener('mousedown', (e) => this.startResize(e, pos));
            this.overlay.appendChild(handle);
          });
        }

        startResize(e, pos) {
          e.preventDefault(); e.stopPropagation();
          const startX = e.clientX;
          const startWidth = this.selectedMedia.clientWidth;
          const startHeight = this.selectedMedia.clientHeight;
          const aspectRatio = startWidth / startHeight;

          const handleDrag = (moveEvent) => {
            let newWidth = pos.includes('e') ? startWidth + (moveEvent.clientX - startX) : startWidth - (moveEvent.clientX - startX);
            if (newWidth < 50) newWidth = 50;
            const newHeight = newWidth / aspectRatio;
            this.selectedMedia.style.width = `${newWidth}px`;
            this.selectedMedia.style.height = `${newHeight}px`;
            this.selectedMedia.setAttribute('width', newWidth);
            this.selectedMedia.setAttribute('height', newHeight);
            this.positionOverlay();
          };

          const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleMouseUp);
            this.quill.update();
          };
          window.addEventListener('mousemove', handleDrag);
          window.addEventListener('mouseup', handleMouseUp);
        }
      }

      Quill.register('modules/mediaResize', MediaResizer);

      const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;
          const formData = new FormData();
          formData.append('file', file);
          try {
            toast.info("Uploading asset to studio...");
            const res = await httpRequest.post(`${endPoints.FileUpload}?folder=temp`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            const range = quillRef.current.getSelection();
            const url = res.data.url; // Use relative path
            
            // Add to session tracking
            sessionFilesRef.current.push(res.data.url);
            
            quillRef.current.insertEmbed(range.index, 'image', url);
            toast.success("Asset committed successfully");
          } catch (error) {
            toast.error("Failed to upload image to studio");
          }
        };
      };

      const videoHandler = () => {
        // Direct Local Upload (Skip prompt as requested)
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'video/mp4,video/quicktime');
        input.click();
        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;
          const formData = new FormData();
          formData.append('file', file);
          try {
            toast.info("Uploading video to studio... Please wait.");
            const res = await httpRequest.post(`${endPoints.FileUpload}?folder=temp`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
            const range = quillRef.current.getSelection();
            const url = res.data.url; // Use relative path
            
            // Add to session tracking
            sessionFilesRef.current.push(res.data.url);
            
            quillRef.current.insertEmbed(range.index, 'localVideo', url);
            toast.success("Video committed successfully");
          } catch (error) {
            toast.error("Video upload failed. Check the file size limit (20MB).");
          }
        };
      };

      const colorHandler = function(value) {
        if (value === 'custom-color') {
          activeFormatRef.current = 'color';
          colorInputRef.current.click();
        } else {
          this.quill.format('color', value);
        }
      };

      const backgroundHandler = function(value) {
        if (value === 'custom-color') {
          activeFormatRef.current = 'background';
          colorInputRef.current.click();
        } else {
          this.quill.format('background', value);
        }
      };

      const quill = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: placeholder,
        modules: {
          mediaResize: true,
          clipboard: {
            matchVisual: false,
            matchers: [
              [Node.TEXT_NODE, (node, delta) => {
                // Ensure consecutive spaces are preserved by converting them to non-breaking spaces
                // This fixes the issue where alignment spaces are lost in the HTML code
                let str = node.data.replace(/[ ]{2,}/g, (match) => '&nbsp;'.repeat(match.length));
                delta.ops[0].insert = str;
                return delta;
              }]
            ]
          },
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              ['link', 'image', 'video'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [
                "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
                "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff",
                "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff",
                "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2",
                "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466",
                "custom-color"
              ]}, { 'background': [
                "#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff",
                "#ffffff", "custom-color"
              ]}],
              [{ 'font': [false, 'serif', 'monospace', 'roboto', 'inter'] }],
              [{ 'align': [] }], 
              ['clean']
            ],
            handlers: {
              image: imageHandler,
              video: videoHandler,
              color: colorHandler,
              background: backgroundHandler
            }
          }
        }
      });

      quillRef.current = quill;
      if (value) quill.root.innerHTML = value;
      quill.on('text-change', () => {
        if (!isUpdatingRef.current) {
          let content = quill.root.innerHTML;
          
          // Enhanced Whitespace Hardening: Convert sequential spaces to HTML entity (&nbsp;)
          // while avoiding spaces inside HTML tags (like src attributes).
          const sanitizedContent = content.replace(/>([^<]+)</g, (match, text) => {
            // Replace 2 or more spaces with &nbsp; entities
            const newText = text.replace(/[ ]{2,}/g, (m) => '&nbsp;'.repeat(m.length));
            return `>${newText}<`;
          });

          if (sanitizedContent !== value) {
            lastEmittedValueRef.current = sanitizedContent;
            onChange?.(sanitizedContent);
          }
        }
      });
    }

    // --- SESSION CLEANUP ON UNMOUNT ---
    return () => {
      // If we unmount and the page wasn't saved, OR it was saved but some files were deleted from editor
      // We need to cleanup any orphaned temp files.
      const currentContent = quillRef.current?.root.innerHTML || "";
      const orphanedFiles = sessionFilesRef.current.filter(fileUrl => {
        // If the page itself is marked as 'savedSuccessfully', we only delete files that are NOT in the final HTML
        // If it's NOT saved, we delete EVERYTHING from the session.
        if (sessionStorage.getItem('studio_save_success') === 'true') {
          return !currentContent.includes(fileUrl);
        }
        return true; 
      });

      if (orphanedFiles.length > 0) {
        httpRequest.post(endPoints.CleanupFiles, { files: orphanedFiles })
          .catch(err => console.error("Session cleanup failed:", err));
      }
      // Reset the flag for the next session
      sessionStorage.removeItem('studio_save_success');
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      // ONLY update if the incoming value is DIFFERENT from what we last sent
      // AND different from what is currently in the editor.
      // This prevents the 'cursor jump' feedback loop.
      if (value !== lastEmittedValueRef.current && value !== quillRef.current.root.innerHTML) {
        isUpdatingRef.current = true;
        quillRef.current.root.innerHTML = value || '';
        isUpdatingRef.current = false;
        
        // Update our ref since we've synced to an external value
        lastEmittedValueRef.current = value;
      }
    }
  }, [value]);

  const handleCustomColorChange = (e) => {
    const selectedColor = e.target.value;
    if (quillRef.current && activeFormatRef.current) {
      quillRef.current.format(activeFormatRef.current, selectedColor);
    }
  };

  return (
    <div className="studio-editor-wrapper bg-white rounded-xl relative">
      {/* Hidden Native Color Picker */}
      <input 
        type="color" 
        ref={colorInputRef} 
        className="hidden" 
        onChange={handleCustomColorChange} 
      />
      
      <div
        ref={containerRef}
        style={{ height: height }}
        className="studio-quill-container shadow-inner"
      />
      <style>{`
        .studio-quill-container { font-family: 'Inter', system-ui, sans-serif; }
        .studio-quill-container .ql-toolbar.ql-snow {
          border-top-left-radius: 12px; border-top-right-radius: 12px;
          border-color: #e2e8f0; background: #f8fafc; padding: 12px; border-bottom: none;
        }
        .studio-quill-container .ql-container.ql-snow {
          border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;
          border-color: #e2e8f0; font-size: 15px; background: #ffffff;
        }
        .studio-quill-container .ql-editor { 
            min-height: 200px; line-height: 1.8; color: #1e293b; padding: 20px; 
            display: flow-root;
        }
        .studio-quill-container .ql-editor img, .studio-quill-container .ql-editor iframe, .studio-quill-container .ql-editor video {
            border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            margin: 10px 5px; max-width: 100%; transition: shadow 0.3s;
            display: inline-block;
            vertical-align: middle;
        }
        .studio-quill-container .ql-editor img:hover, .studio-quill-container .ql-editor iframe:hover, .studio-quill-container .ql-editor video:hover {
            box-shadow: 0 0 0 4px rgba(255, 77, 45, 0.2);
            cursor: pointer;
        }
        
        /* Custom Native Color Icon Styling */
        .ql-color .ql-picker-options .ql-picker-item[data-value="custom-color"],
        .ql-background .ql-picker-options .ql-picker-item[data-value="custom-color"] {
          background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
          border: 1px solid #ccc;
          position: relative;
        }
        .ql-color .ql-picker-options .ql-picker-item[data-value="custom-color"]::after,
        .ql-background .ql-picker-options .ql-picker-item[data-value="custom-color"]::after {
          content: 'PICK';
          font-size: 6px;
          color: white;
          position: absolute;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          font-weight: bold;
          text-shadow: 1px 1px 1px black;
        }

        .ql-align-center { text-align: center; display: block !important; margin-left: auto !important; margin-right: auto !important; }
        .ql-align-right { text-align: right; display: block !important; margin-left: auto !important; }
        .ql-align-left { text-align: left; }
      `}</style>
    </div>
  );
};

export default StudioEditor;
