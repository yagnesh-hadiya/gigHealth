import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill/dist/quill.core.css";
import { CustomRichTextEditorProps } from "../../types/FacilityTypes";

const CustomRichTextEditor = ({
  content,
  handleChange,
  readOnly = false,
  className,
  disabled,
}: CustomRichTextEditorProps) => {
  return (
    <div
      className={className}
      style={{
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ReactQuill
        readOnly={readOnly}
        theme="snow"
        value={content}
        onChange={handleChange}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            [{ header: 1 }, { header: 2 }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        }}
      />
    </div>
  );
};

export default CustomRichTextEditor;
