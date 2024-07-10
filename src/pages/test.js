export default function About() {
    return (
      <div className="p-6 items-center">
        <h1 className="text-3xl font-bold text-yellow-500 mb-4">About Us</h1>
        <p className="text-gray-200">
            <iframe
            width="560"
            height="315"
            src="http://localhost:4000/?anime_id=ookami-to-koushinryou-merchant-meets-the-wise-wolf&episode=14&quality=1080p&server=gogocdn"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            ></iframe>
        </p>
      </div>
    );
  }
