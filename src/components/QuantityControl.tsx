interface Props {
  quantity: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityControl({
  quantity,
  max,
  onIncrease,
  onDecrease,
}: Props) {
  return (
    <div className="qty">
      <button aria-label="Decrease quantity" onClick={onDecrease}>
        −
      </button>
      <span>{quantity}</span>
      <button
        aria-label="Increase quantity"
        onClick={onIncrease}
        disabled={quantity >= max}
      >
        +
      </button>
    </div>
  );
}