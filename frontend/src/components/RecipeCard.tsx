type CardProps = {
  title: string;
  price: number;
  time: number;
  image: string;
  description: string;
};

export default function Card({ title, price, time, image, description }: CardProps) {
  const handleClick = () => {
    console.log("Card clicked:", title);
  };

  return (
    <div onClick={handleClick} className="grid grid-cols-[100px_1fr] gap-4 bg-gray-100 rounded-xl p-2 items-center">
      <img src={image} alt={title} className="rounded-xl" />
      <div className="gap-1 flex flex-col">
        <h4 className="font-bold text-[18px]">{title}</h4>
        <p className="text-sm text-gray-700">{description}</p>
        <div className="flex gap-2">
          <span className="p-1 px-5 bg-blue-400 rounded-full text-white font-bold">{price}€</span>
          <span className="p-1 font-medium">{time}min</span>
        </div>
      </div>
    </div>
  );
}
