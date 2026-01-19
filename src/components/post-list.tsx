import { useFetch } from "../hooks/useFetch";
import type { Post } from "../types";
import { useState } from "react";

export function PostList() {
  const { data, loading, error } = useFetch<Post[]>(
    "https://jsonplaceholder.typicode.com/posts"
  );

  const [search, setSearch] = useState<string>("");

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return null;

  const filteredPosts = data.filter(post =>
    `${post.title}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2
        style={{
          fontSize: '2rem',
          color: '#2f3f73',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '1rem',
          fontWeight: '800',
          background: 'linear-gradient(90deg, #e66465 0%, #9198e5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 10px rgba(67, 81, 117, 0.12)'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            borderRadius: '10px',
            backgroundColor: '#f4e5ff90',
            boxShadow: '0 4px 20px 0 #d3c6f6',
            border: '2px solid #c9b5e6'
          }}
        >
          Posts
        </span>
      </h2>
      {/* Search/filter input */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
        { <input
          type="text"
          placeholder="Search posts by Title ..."
          value={search || ""}
          onChange={e => setSearch(e.target.value)} 
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid #d3c6f6',
            fontSize: '1rem',
            width: '260px',
            boxShadow: '0 2px 7px #e6eaff50'
          }}
        /> }
      </div>
      <table style={{
        borderCollapse: 'collapse',
        width: '100%',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        marginTop: '1rem',
        backgroundColor: '#f9f9fb'
      }}>
        <thead>
          <tr>
            <th style={{
              border: '1px solid #ddd',
              padding: '10px',
              backgroundColor: '#f3f3f7',
              textAlign: 'left'
            }}>ID</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '10px',
              backgroundColor: '#f3f3f7',
              textAlign: 'left'
            }}>Title</th>
            <th style={{
              border: '1px solid #ddd',
              padding: '10px',
              backgroundColor: '#f3f3f7',
              textAlign: 'left'
            }}>Body</th>
          </tr>
        </thead>
        <tbody>
            {filteredPosts.length === 0 ? (
                <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '10px' }}>No posts found</td>
                </tr>
            ) : (
                filteredPosts.map(post => (
                    <tr key={post.id}>
                        <td>{post.id}</td>
                        <td>{post.title}</td>
                        <td>{post.body}</td>
                    </tr>
                ))
            )}
        </tbody>
      </table>
    </div>
  );
}
