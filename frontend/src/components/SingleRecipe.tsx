type CardProps = {
  title: string;
  price: number;
  time: number;
  image: string;
  description: string;
  steps: string[];
  protein: number;
  calories: number;
  fat: number;
  carbohydrates: number;
  tags: string[];
  allergens: string[];
};

export default function Card({
  title,
  price,
  time,
  image,
  description,
  steps,
  protein,
  calories,
  fat,
  carbohydrates,
  tags,
  allergens,
}: CardProps) {
  return (
    <div className="max-w-[500px] mx-5 h-screen gap-[2rem] flex flex-col">
      <img src={image} alt={title} className="rounded-xl" />
      <div className="grid grid-cols-[100px_1fr] gap-4 bg-gray-100 rounded-xl p-2 items-center">
        <div className="flex flex-col">
          <span className="font-bold">Protein:</span>
          <span>{protein}g</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Calories:</span>
          <span>{calories}kcal</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Fat:</span>
          <span>{fat}g</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold">Carbohydrates:</span>
          <span>{carbohydrates}g</span>
        </div>
      </div>
      <p>{description}</p>
    </div>
  );
}
