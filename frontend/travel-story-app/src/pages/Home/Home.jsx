import React, { useState, useEffect } from "react";
import Navbar from '../../components/Navbar'
import { useNavigate } from "react-router-dom"
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import EmptyCard from "../../components/Cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage } from "../../utils/helper";


const Home = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [FilterType, setFilterType] = useState('');

  const [dateRange, setDateRange] = useState({ form: null, to: null });

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        // Set user info if data exists
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        // Clear storage if unauthorized
        localStorage.clear();
        navigate("/login"); //Redirect to login
      }
    }
  };

  //Get all travel stories
  const getAllTravelStories = async () => {
    try{
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error){
      console.log("An unepected error occured. Please try again.");
    }
  }

  // Handle Edit story click
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data });
  }

  // handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data });
  };

  // handle uodate Favourite
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");

        if (FilterType === "search" && searchQuery){
          onSearchStory(searchQuery);
        } else if (FilterType === "date"){
          filterStoriesByDate(dateRange);
        } else {
        getAllTravelStories();
        }
      }
    } catch (error) {
        console.error("Error updating favorite status:", error.response?.data || error.message);
    }
  };

  // Delete Story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if(response.data && !response.data.error) {
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories();
      }
    }catch (error) {
        console.log("An unexpected error occured. Please try again.");
      }
    }
  
  // Search Story
  const onSearchStory = async (query)=>{
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      });

      if(response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    }catch (error) {
        console.log("An unexpected error occured. Please try again.");
      }
  }

  const handleClearSearch = ()=>{
      setFilterType("");
      getAllTravelStories();
  };


  // Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try{
      const startDate = day.from? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter",{
          params: { startDate, endDate },
        });

        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  // Handle Date Range Select 
  const handleDayClick = (day)=>{
    setDateRange(day);
    filterStoriesByDate(day);
  }

  const resetFilter =()=>{
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  }

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();

    return () => {};
  }, []);

  return (
    <>
      <Navbar 
      userInfo={userInfo} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery}
      onSearchNote={onSearchStory} 
      handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">

      <FilterInfoTitle
        filterType={FilterType}
        filterDates={dateRange}
        onClear={() => {
          resetFilter();
        }}
        />


        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}
                      
                      onClick={() => handleViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                      />
                  );
                })}
              </div>
            ) : (
              <EmptyCard
              message={getEmptyCardMessage(FilterType)}
               />
            )}
          </div>
          
          
          <div className="w-[350px]">
          <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
            <div className="p-3">
              <DayPicker
                captionLayout="dropdown-buttons"
                mode="range"
                selected={dateRange}
                onSelect={handleDayClick}
                pagedNavigation
                />
            </div>
            </div>
          </div>
            
        </div>
      </div>

      {/* add and edit travel story model */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
        >
            <AddEditTravelStory
              type={openAddEditModal.type}
              storyInfo={openAddEditModal.data}
              onClose={() => {
                setOpenAddEditModal({ isShown: false, type: "add", data: null });
              }}
              getAllTravelStories={getAllTravelStories}
            />
        </Modal>

        {/* view travel story model */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
        >
          <ViewTravelStory storyInfo={openViewModal.data || null} 
          onClose={()=>{
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false}));
          }}
          onEditClick={()=>{
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false}));
            handleEdit(openViewModal.data || null)
          }}
          onDeleteClick={()=>{
            deleteTravelStory(openViewModal.data || null);
          }}
          />
        </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
};

export default Home;
