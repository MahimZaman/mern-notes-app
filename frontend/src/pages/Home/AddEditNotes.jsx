import React, { useState } from "react";
import TagInput from "../../components/Inputs/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, getAllNotes, type, onClose, showToastMsg }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  // Add New Note
  const addNewNote = async () => {
    try {
      const res = await axiosInstance.post("/add-note", {
        title: title,
        content: content,
        tags: tags,
      });

      if(res.data && res.data.note){
        showToastMsg("Note Added Successfully")
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
    }
  };

  // Edit Note
  const editNote = async (noteID) => {
    if(!noteID){
        setError("Note not found");
        return;
    }
    try{
        const res = await axiosInstance.put(`/edit-note/${noteID}`, {
            title, 
            content, 
            tags: tags || []            
        });

        if(res.data && res.data.note){
            showToastMsg("Note Updated Successfully")
            getAllNotes();
            onClose();
        }
    }catch(error){
        if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message);
        }
    }
  };

  // Handle Note Form
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter a title");
      return;
    }

    if (!content) {
      setError("Please enter the content.");
      return;
    }

    setError("");

    if (type == "edit") {
      editNote(noteData._id);
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute top-3 right-3 bg-slate-100"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go to gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />

        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">Content</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder="Content"
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        <div className="mt-3">
          <label className="input-label">Tags</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

        <button
          className="btn-primary font-medium mt-5 p-3"
          onClick={() => {
            handleAddNote();
          }}
        >
          {type == 'edit' ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
