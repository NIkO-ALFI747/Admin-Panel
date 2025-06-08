import Image from './Image.jsx'
import Title from './Title.jsx'
import Description from './Description.jsx'

function ImageSection({className, image}) {
  return (
    <div
      className={`col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column ${className}`}
      style={{ background: "#103cbe" }}
    >
      <Image image={image}/>
      <Title />
      <Description />
    </div>
  );
}

export default ImageSection;