const logos = [
  {
    img: {
      src: "/images/logos/tythe.png",
      alt: "Tythe",
    },
  },
  {
    img: {
      src: "/images/logos/cast.png",
      alt: "CAST",
    },
  },
  {
    img: {
      src: "/images/logos/timetospare.png",
      alt: "Time to Spare",
    },
  },
  {
    img: {
      src: "/images/logos/givingisgreat.png",
      alt: "Giving is Great",
    },
  },
  {
    img: {
      src: "/images/logos/sib.png",
      alt: "Social Investment Business",
    },
  },
  {
    img: {
      src: "/images/logos/cytora.png",
      alt: "Cytora",
    },
  },
]

export default function LogoCloud() {
  return (
    <div className="bg-white max-w-4xl mx-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <p className="text-center text-base font-semibold uppercase text-gray-600 tracking-wider">
          Powering startups, grantmakers and researchers
        </p>
        <div className="mt-6 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-8">
          {logos.map(({ img }, i) => (
            <div
              key={i}
              className="col-span-1 flex justify-center items-center py-8 px-8 bg-gray-50"
            >
              <img
                className={`max-h-12 ${img.alt === "CAST" ? "p-3" : ""}`}
                {...img}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
