"use client";

export default function BaseFundo({
  fixedOverlay = false,
  rotationDeg = 0,
}: {
  fixedOverlay?: boolean;
  rotationDeg?: number;
}) {
  return (
    <div
      className={
        fixedOverlay
          ? "w-[100dvw] h-[100dvh] flex justify-center items-center"
          : "w-[100dvw] h-[100dvh] flex justify-center items-center absolute left-0 top-[100dvh] overflow-hidden"
      }
    >
      <div
        className="centroRotador catavento"
        style={{
          // @ts-expect-error CSS var type
          "--catavento-rot": `${rotationDeg}deg`,
        }}
      >
        <div className="paRotador1">
          <div className="internoPa1">
            <div className="interno2pa1"></div>
          </div>
        </div>
        <div className="paRotador2">
          <div className="internoPa2">
            <div className="interno2pa2"></div>
          </div>
        </div>
        <div className="paRotador3">
          <div className="internoPa3">
            <div className="interno2pa3"></div>
          </div>
        </div>
        <div className="paRotador4">
          <div className="internoPa4">
            <div className="interno2pa4"></div>
          </div>
        </div>

        <div className="centroReferencia">
          <div className="referencia w-[800px] h-[800px]  absolute transform rotate-45 flex justify-center items-center">
            <div className="w-[200px] h-[200px] absolute bottom-[-100px] right-[100px] rounded-full flex justify-center items-center transform rotate-245"></div>

            <div className="w-[200px] h-[200px] absolute bottom-[100px] left-[-100px] rounded-full flex justify-center items-center transform rotate-245"></div>

            <div className="w-[200px] h-[200px] absolute top-[-100px] left-[100px] rounded-full flex justify-center items-center transform rotate-245"></div>

            <div className="w-[200px] h-[200px] absolute top-[100px] right-[-100px] rounded-full flex justify-center items-center transform rotate-245"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
