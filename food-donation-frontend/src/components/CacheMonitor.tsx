import { useState, useEffect } from "react";
import axios from "axios";

interface CacheStats {
  cacheEnabled: boolean;
  cacheSize: number;
  totalNgos: number;
  memoryUsage: number;
  maxMemory: number;
  timestamp?: number;
}

const CacheMonitor = () => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8082/cache/stats");
      setStats(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch cache stats");
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      setLoading(true);
      await axios.delete("http://localhost:8082/cache/clear");
      await fetchStats(); // Refresh stats
    } catch (err) {
      setError("Failed to clear cache");
    } finally {
      setLoading(false);
    }
  };

  const warmCache = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8082/cache/warm");
      await fetchStats(); // Refresh stats
    } catch (err) {
      setError("Failed to warm cache");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading && !stats) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h3>Loading cache stats...</h3>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "1rem", 
      backgroundColor: "#f8f9fa", 
      borderRadius: "8px",
      border: "1px solid #ddd"
    }}>
      <h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
        🔄 Redis Cache Monitor
      </h3>

      {error && (
        <div style={{ 
          padding: "0.5rem", 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          ❌ {error}
        </div>
      )}

      {stats && (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: "1rem",
          marginBottom: "1rem"
        }}>
          <div style={{
            padding: "1rem",
            backgroundColor: stats.cacheEnabled ? "#e8f5e8" : "#ffebee",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: stats.cacheEnabled ? "#2e7d32" : "#c62828" }}>
              {stats.cacheEnabled ? "✅" : "❌"} Cache Status
            </h4>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {stats.cacheEnabled ? "Enabled" : "Disabled"}
            </div>
          </div>

          <div style={{
            padding: "1rem",
            backgroundColor: "#e3f2fd",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#1976d2" }}>
              📊 Cache Size
            </h4>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1976d2" }}>
              {stats.cacheSize} entries
            </div>
          </div>

          <div style={{
            padding: "1rem",
            backgroundColor: "#f3e5f5",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#7b1fa2" }}>
              🏥 Total NGOs
            </h4>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#7b1fa2" }}>
              {stats.totalNgos}
            </div>
          </div>

          <div style={{
            padding: "1rem",
            backgroundColor: "#fff3e0",
            borderRadius: "6px",
            textAlign: "center"
          }}>
            <h4 style={{ margin: "0 0 0.5rem 0", color: "#f57c00" }}>
              💾 Memory Usage
            </h4>
            <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#f57c00" }}>
              {formatBytes(stats.memoryUsage)}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#666" }}>
              Max: {formatBytes(stats.maxMemory)}
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        display: "flex", 
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        <button
          onClick={fetchStats}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          🔄 Refresh Stats
        </button>

        <button
          onClick={clearCache}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          🗑️ Clear Cache
        </button>

        <button
          onClick={warmCache}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          🔥 Warm Cache
        </button>
      </div>

      {stats && (
        <div style={{ 
          marginTop: "1rem", 
          padding: "0.5rem", 
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
          fontSize: "0.8rem",
          color: "#666"
        }}>
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default CacheMonitor; 