import { useState } from 'react';
import { useAbortableSearch } from '../hooks/useAbortable';
import { typedFetch } from '../api/typedFetch';

interface SearchResult {
  id: number;
  title: string;
  body: string;
}

interface SearchResponse {
  posts: SearchResult[];
  total: number;
}

export function SearchDemo() {
  const [requestCount, setRequestCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);

  const searchPosts = async (query: string, signal: AbortSignal): Promise<SearchResponse> => {
    setRequestCount(prev => prev + 1);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    
    const result = await typedFetch<SearchResult[]>(
      `https://jsonplaceholder.typicode.com/posts`,
      { signal }
    );

    if (!result.ok) {
      if (result.message === 'Request cancelled') {
        setCancelledCount(prev => prev + 1);
        throw new Error('Request cancelled');
      }
      throw new Error(result.message);
    }

    const filtered = result.data.filter(
      post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 15);

    setCompletedCount(prev => prev + 1);
    
    return {
      posts: filtered,
      total: filtered.length
    };
  };

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    aborted,
    cancel
  } = useAbortableSearch(searchPosts, 300);

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <h2
        style={{
          fontSize: '1.8rem',
          marginBottom: '1rem',
          color: '#333',
          fontWeight: '600'
        }}
      >
        Abortable Search Demo
      </h2>
      
      <p
        style={{
          color: '#666',
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}
      >
        Type in the search box below. Previous requests are automatically cancelled
        when you type quickly. Watch the request counters to see cancellations in action.
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            color: '#666'
          }}
        >
          <span>
            <strong>Requests:</strong> {requestCount}
          </span>
          <span>|</span>
          <span style={{ color: '#10b981' }}>
            <strong>Completed:</strong> {completedCount}
          </span>
          <span>|</span>
          <span style={{ color: '#ef4444' }}>
            <strong>Cancelled:</strong> {cancelledCount}
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts (By Any Keywords)..."
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#7d5fff';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
          }}
        />
        
        {loading && (
          <div
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#7d5fff'
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #7d5fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }}
            />
            <span style={{ fontSize: '0.875rem' }}>Searching...</span>
          </div>
        )}

        {loading && (
          <button
            onClick={cancel}
            style={{
              position: 'absolute',
              right: loading ? '8rem' : '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.875rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ef4444';
            }}
          >
            Cancel
          </button>
        )}
      </div>

      {aborted && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '0.875rem'
          }}
        >
          ⚠️ Previous request was cancelled
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#991b1b',
            fontSize: '0.875rem'
          }}
        >
          ❌ Error: {error.message}
        </div>
      )}

      {results && (
        <div>
          <div
            style={{
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: '#666'
            }}
          >
            Found {results.total} result{results.total !== 1 ? 's' : ''}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: '#333'
                  }}
                >
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {post.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !results && query && (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#999',
            fontSize: '0.9rem'
          }}
        >
          No results found for "{query}"
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
