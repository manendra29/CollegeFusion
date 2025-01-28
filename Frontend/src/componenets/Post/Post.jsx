import { FileX, Heart, MessageCircle } from 'lucide-react';
import './Post.css';
import {  useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {Context} from "../../main"
import Comment from './Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Post = ({ post,isOwner }) => {
  const [user, setUser] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like.length); 
  const {isAuthorized,user:currUser}=useContext(Context);
  const [comments,setComments]=useState(post.comment || []);



  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);
  const navigateTo=useNavigate();

 


  const fetchUser = async () => {
    try {
      const id = post.userId ?? post.clubId;
      const response = await axios.get(`http://localhost:5000/api/v1/user/getuser/${id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUser(response.data.user);

      const currentUserId = currUser._id;
      setIsLiked(post.like.includes(currentUserId));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };




  useEffect(() => {
    fetchUser();
  }, [post.userId, post.clubId, post.like,post.comment]);

  const handleLikeButton = async () => {
    try {
      if (!isLiked) {
        await axios.put(
          `http://localhost:5000/api/v1/post/like/${post._id}`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      } else {
        await axios.put(
          `http://localhost:5000/api/v1/post/unlike/${post._id}`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleDeleteButton=async()=>{
    try {
      const response=await axios.delete(`http://localhost:5000/api/v1/post/delete/${post._id}`,{
        withCredentials:true,
        headers:{
          "Content-Type":"application/json"
        }
      });
      toast.success("Post has been deleted");
      console.log("Post deleted");
      
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <article className="post">
      <div className="post-head">
        <img
         onClick={()=> navigateTo(`/profile/${user._id}`) }
          src={user.profilePicture?.url ?? user.clubImage?.url ?? "/images/noPP.jpg"}
          alt="profilepicture"
          className="Profilepicture"
        />
        <h2 style={{cursor:"pointer"}}  onClick={()=>( post.userId===currUser._id ? navigateTo(`/myprofile`):navigateTo(`/profile/${user._id}` )) }>{user.username ?? user.name}</h2>
        {isOwner && <DeleteIcon className="deleteicon" onClick={handleDeleteButton}/>}
      </div>

      <h2 className="post-title">{post.title}</h2>
      <p className="post-description">{post.description}</p>
      <img
        src={post.postImage?.url}
        alt="post content"
        className="post-image"
      />
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLikeButton}
        >
          <Heart fill={isLiked ? 'red' : 'none'} />
          <span>{likeCount}</span>
        </button>
        <button 
    className="action-btn"
    onClick={() => setIsCommentSectionOpen(!isCommentSectionOpen)}>
    <MessageCircle />
    <span>{post.comment.length}</span>
  </button>
 
      </div>
      <Comment 
      post={post}
    postId={post._id}
    isOpen={isCommentSectionOpen}
    comments={comments}
    fetchUser={fetchUser}
    setComments={setComments}
    currUser={currUser}
  />
    </article>
  );
};

export default Post;
