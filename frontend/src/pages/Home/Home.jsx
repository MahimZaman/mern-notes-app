import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import Empty from "../../components/Empty/Empty";
import addNoteImage from "../../assets/images/add-note.svg";
import searchNotFound from "../../assets/images/search-not-found.svg";

function Home() {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [userInfo, setUserInfo] = useState(null);

  const [notes, setNotes] = useState([]);

  const [showToast, setShowToast] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const res = await axiosInstance.get("/get-all-notes");

      if (res.data && res.data.notes) {
        setNotes(res.data.notes);
      }
    } catch (error) {
      if (error.response.status === 401) {
        console.error(error.response.data.message);
      }
    }
  };

  const editNoteModal = (noteData) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: noteData,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete("/delete-note/" + id);

      if (res.data && res.data.message) {
        showToastMsg("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error("An unexprected error has occured. Please try again");
      }
    }
  };

  const handlePinNote = async (noteData) => {
    const isPinned = !noteData.isPinned;
    const id = noteData._id;

    try {
      const res = await axiosInstance.put(`/update-pin-note/${id}`, {
        isPinned,
      });

      if (res.data && res.data.message) {
        getAllNotes();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.error(error.response.data.message);
      }
    }
  };

  const showToastMsg = (message, type) => {
    setShowToast({
      isShown: true,
      message,
      type,
    });
  };

  const handleToastClose = () => {
    setShowToast({
      isShown: false,
      message: "",
    });
  };

  // Search for notes
  const onSearchNote = async (query) => {
    if (query == '') {
      getAllNotes();
      return;
    }

    try {
      const res = await axiosInstance("/search-notes", {
        params: { query },
      });

      if (res.data && res.data.notes) {
        setIsSearch(true);
        setNotes(res.data.notes);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle Clear Search
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getUserInfo();
    getAllNotes();
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
        condition={{
          search: "show",
          user: "show",
        }}
      />

      <div className="container mx-auto">
        {notes.length > 0 ? (
          <div className="px-3 grid xs:grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {notes?.map((note, index) => {
              return (
                <NoteCard
                  key={note._id}
                  title={note.title}
                  date={note.createdOn}
                  content={note.content}
                  isPinned={note.isPinned}
                  tags={note.tags}
                  onEdit={() => editNoteModal(note)}
                  onDelete={() => handleDelete(note._id)}
                  onPinNote={() => handlePinNote(note)}
                  onClick={() => editNoteModal(note)}
                />
              );
            })}
          </div>
        ) : (
          <Empty
            imgSrc={isSearch ? searchNotFound : addNoteImage}
            message={
              isSearch
                ? `Sorry no results matching your query was found`
                : `No notes have been added yet. Click on the "+" button to add your first note.`
            }
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="lg:w-[70%] xl:w-[40%] w-[90%] max-h-[75%] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() =>
            setOpenAddEditModal({
              isShown: false,
              type: "add",
              data: null,
            })
          }
          getAllNotes={getAllNotes}
          showToastMsg={showToastMsg}
        />
      </Modal>

      <ToastMessage
        isShown={showToast.isShown}
        type={showToast.type}
        message={showToast.message}
        onClose={handleToastClose}
      />
    </>
  );
}

export default Home;
