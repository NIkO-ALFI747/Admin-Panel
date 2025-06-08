
function Image({image}) {
  return (
    <div className="featured-image mb-3">
      <img src={image} className="img-fluid" style={{ width: "250px" }} />
    </div>
  );
}

export default Image;