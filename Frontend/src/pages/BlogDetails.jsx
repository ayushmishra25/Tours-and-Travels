import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, baseURL]);

  if (loading) return <p>Loading...</p>;
  if (!blog) return <p>Blog not found.</p>;

  return (
    <div className="blog-details-container">
      <nav className="blog-navbar">
        <div className="logo">
          <Link to="/">
            <img src="/logo.webp" alt="Sahyog Force Logo" className="navbar-logo" />
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <div className="blog-details">
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="blog-details-image" />
        )}
        <h1>{blog.title}</h1>
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetails;
