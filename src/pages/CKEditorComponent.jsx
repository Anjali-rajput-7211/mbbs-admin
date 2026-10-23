import React, { useEffect, useRef } from "react";

// ==========================================
// CKEDITOR 5 CLASSIC COMPONENT (BEGINNER FRIENDLY)
// Renders rich text formatting toolbar for email descriptions
// ==========================================

const CKEditorComponent = ({
  value = "",
  onChange,
  placeholder = "Enter template description / content...",
}) => {
  const containerRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const isUpdatingFromPropRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Helper to start CKEditor
    const startEditor = () => {
      if (!containerRef.current || !window.ClassicEditor) return;
      if (editorInstanceRef.current) return; // Prevent double init

      window.ClassicEditor.create(containerRef.current, {
        placeholder: placeholder,
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "blockQuote",
            "insertTable",
            "undo",
            "redo",
          ],
        },
      })
        .then((editor) => {
          if (!isMounted) {
            editor.destroy();
            return;
          }
          editorInstanceRef.current = editor;

          // Set initial content
          if (value) {
            editor.setData(value);
          }

          // Listen for typing / content updates
          editor.model.document.on("change:data", () => {
            if (isUpdatingFromPropRef.current) return;
            const data = editor.getData();
            if (onChange) {
              onChange(data);
            }
          });
        })
        .catch((error) => {
          console.error("CKEditor initialization error:", error);
        });
    };

    // Check if script is already present
    if (window.ClassicEditor) {
      startEditor();
    } else {
      // Dynamic fallback script loader
      const scriptId = "ckeditor-classic-cdn";
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.ckeditor.com/ckeditor5/41.4.2/classic/ckeditor.js";
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", startEditor);
    }

    return () => {
      isMounted = false;
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy().catch(() => {});
        editorInstanceRef.current = null;
      }
    };
  }, []);

  // Sync external changes (e.g. form reset or editing another item)
  useEffect(() => {
    if (editorInstanceRef.current) {
      const currentData = editorInstanceRef.current.getData();
      if (value !== undefined && value !== currentData) {
        isUpdatingFromPropRef.current = true;
        editorInstanceRef.current.setData(value || "");
        isUpdatingFromPropRef.current = false;
      }
    }
  }, [value]);

  return (
    <div className="w-full">
      <div ref={containerRef} />
    </div>
  );
};

export default CKEditorComponent;
