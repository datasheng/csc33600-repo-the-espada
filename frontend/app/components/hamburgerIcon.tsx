"use client"

export default function HamburgerIcon() {
  return (
    <button className="hamburger">
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
      
      <style jsx>{`
        .hamburger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .bar {
          width: 25px;
          height: 3px;
          background-color: #333;
          margin: 4px 0;
          transition: 0.4s;
        }
      `}</style>
    </button>
  );
}