import React, { useRef, useContext } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import { Utils } from "../contexts/Utils";

export default function State() {
    const { lerp, invlerp } = useContext(Utils);

    // #################################################
    //   ACTIONS
    // #################################################

    const isHidden = useRef(true);
    const [{ y }, spring] = useSpring(() => ({ y: "80%" }));

    const hideContainer = () => {
        isHidden.current = true;
        spring.start({ y: "80%" });
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
                if (my > containerHeight * 0.5 || vy > 1) hideContainer();
                else if (my < -containerHeight * 0.5 || vy < -1) showContainer();
                else if (isHidden.current) hideContainer();
                else showContainer();
            }

            // Update the position while the gesture is active
            else {
                var displ = isHidden.current ? invlerp(-containerHeight, 0, my) : invlerp(0, containerHeight, my);
                var percentageDispl = lerp(0, 80, displ);
                spring.start({ y: `${percentageDispl}%` });
            }
        },
        { filterTaps: true, axis: "y" }
    );

    return (
        <div className="state">
            <animated.div className="container" ref={continerRef} {...gestureBind()} style={{ y }}>
                <div className="handle"></div>
                <div className="data"></div>
            </animated.div>
        </div>
    );
}
