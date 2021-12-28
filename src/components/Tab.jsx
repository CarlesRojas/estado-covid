import React, { useRef, useContext } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import { Utils } from "../contexts/Utils";
import CovidData from "./CovidData";

const HIDDEN_PERCENTAGE = 0.7;

export default function Tab() {
    // console.log("Render Tab");

    const { lerp, invlerp } = useContext(Utils);

    // #################################################
    //   ACTIONS
    // #################################################

    const isHidden = useRef(true);
    const [{ y }, spring] = useSpring(() => ({ y: `${HIDDEN_PERCENTAGE * 100}%` }));

    const hideContainer = () => {
        isHidden.current = true;
        spring.start({ y: `${HIDDEN_PERCENTAGE * 100}%` });
    };

    const showContainer = () => {
        isHidden.current = false;
        spring.start({ y: "0%" });
    };

    // #################################################
    //   GESTURE
    // #################################################

    const continerRef = useRef(null);

    // Vertical gesture
    const gestureBind = useDrag(
        ({ event, down, vxvy: [, vy], movement: [, my] }) => {
            // Stop event propagation
            event.stopPropagation();

            var containerHeight = continerRef.current.offsetHeight;

            // Snap to hide or show
            if (!down) {
                if ((my > containerHeight * 0.1 && vy >= 0) || vy > 1) hideContainer();
                else if ((my < -containerHeight * 0.1 && vy <= 0) || vy < -1) showContainer();
                else if (isHidden.current) hideContainer();
                else showContainer();
            }

            // Update the position while the gesture is active
            else {
                var displ = isHidden.current
                    ? invlerp(-containerHeight * HIDDEN_PERCENTAGE, 0, my)
                    : invlerp(0, containerHeight * HIDDEN_PERCENTAGE, my);
                var percentageDispl = lerp(0, HIDDEN_PERCENTAGE * 100, displ);
                spring.start({ y: `${percentageDispl}%` });
            }
        },
        { filterTaps: true, axis: "y" }
    );

    return (
        <div className="tab">
            <animated.div className="container" ref={continerRef} {...gestureBind()} style={{ y }}>
                <div className="handle"></div>
                <CovidData />
            </animated.div>
        </div>
    );
}
