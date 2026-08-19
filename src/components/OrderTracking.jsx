const STEPS = [
  { key: "Diproses", label: "Dikemas", icon: "📦" },
  { key: "Dikirim", label: "Dikirim", icon: "🚚" },
  { key: "Selesai", label: "Selesai", icon: "✅" },
];

function OrderTracking({ status }) {
  if (status === "Dibatalkan") {
    return (
      <div className="order-tracking order-tracking--cancelled">
        <span>✕</span>
        Pesanan dibatalkan
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="order-tracking">
      {STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div className="order-tracking__step" key={step.key}>
            <div className="order-tracking__line-wrap">
              {index > 0 && (
                <span
                  className={
                    "order-tracking__line" +
                    (index <= currentIndex ? " order-tracking__line--done" : "")
                  }
                />
              )}

              <span
                className={
                  "order-tracking__dot" +
                  (isDone ? " order-tracking__dot--done" : "") +
                  (isCurrent ? " order-tracking__dot--current" : "")
                }
              >
                {step.icon}
              </span>
            </div>

            <span
              className={
                "order-tracking__label" +
                (isCurrent ? " order-tracking__label--current" : "")
              }
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default OrderTracking;
