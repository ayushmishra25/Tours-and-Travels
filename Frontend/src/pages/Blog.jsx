import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/blogs`);
        console.log('API Response:', res.data);

        // Ensure blogs is always an array
        if (Array.isArray(res.data)) {
          setBlogs(res.data);
        } else if (res.data && Array.isArray(res.data.blogs)) {
          setBlogs(res.data.blogs);
        } else {
          setBlogs([]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setBlogs([]); // keep safe
      }
    };

    fetchBlogs();
  }, [baseURL]);

  const filteredBlogs = blogs.filter(blog =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-list-container">
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

      <header className="blog-header">
        <h1>SahyogForce Car Care & Driving Blog</h1>
        <p>Your go-to resource for premium police-verified drivers</p>
        <p>on demand, available 24/7 or by the hour.</p>
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="blog-search"
        />
      </header>

      <div className="blog-grid">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map(blog => (
            <div key={blog.id} className="blog-card">
              {blog.image && <img src={blog.image} alt={blog.title} />}
              <div className="content">
                <h2>{blog.title}</h2>
                <p>
                  {blog.content?.split(' ').slice(0, 50).join(' ')}...
                  <Link to={`/blog/${blog.id}`} className="read-more"> Read More</Link>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No matching blogs found.</p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
