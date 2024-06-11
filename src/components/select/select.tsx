import React, { useEffect, useRef, useId } from "react";
import { LinkedList } from "../linked-list-node";

export const Select = () => {
    const listBoxId = useId();

    const selectTriggerRef = useRef<HTMLButtonElement>(null);
    const listBoxRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!listBoxRef.current || !selectTriggerRef.current) return;

        function supportsPopover() {
            return HTMLElement.prototype.hasOwnProperty("popover");
        }

        const popoverSupported = supportsPopover();
        const popover = listBoxRef.current;
        const trigger = selectTriggerRef.current;

        if (popoverSupported) {
            popover.popover = "auto";
            trigger.popoverTargetElement = popover;
            trigger.popoverTargetAction = "toggle";
        } else {
            console.log("Popover API not supported.");
        }
    }, [listBoxRef, selectTriggerRef]);

    const onKeyDownHandler: React.KeyboardEventHandler<HTMLButtonElement> = (
        event
    ) => {
        const { key } = event;

        switch (key) {
            case "ArrowDown":
            case "ArrowUp":
            case "Enter":
            case "Space":
                listBoxRef.current?.showPopover();
                event.preventDefault();
                event.stopPropagation();
                break;

            default:
                break;
        }
    };

    return (
        <>
            <button
                role="combobox"
                onKeyDown={onKeyDownHandler}
                ref={selectTriggerRef}
            >
                Trigger
            </button>
            <ListBox
                id={listBoxId}
                role="listbox"
                tabIndex={-1}
                ref={listBoxRef}
            >
                <Option>Option #1</Option>
                <Option>Option #2</Option>
                <Option>Option #3</Option>
            </ListBox>
        </>
    );
};

interface ListBox extends React.ComponentProps<"ul"> {
    children: React.ReactElement<OptionProps, "li">[];
}

const ListBox = React.forwardRef<HTMLUListElement, ListBox>(
    ({ children, ...props }, forwardRef) => {
        // const options = new LinkedList<React.RefObject<HTMLLIElement>>();
        const optionsMap = new Map();

        return (
            <ul
                role="listbox"
                tabIndex={-1}
                onClick={() => {
                    // console.log("ref: ", options.values()[1].current);
                    console.log("ref: ", optionsMap);
                }}
                ref={forwardRef}
                {...props}
            >
                {React.Children.map(children, (child) => {
                    const optionRef = React.createRef<HTMLLIElement>();
                    // options.append(optionRef);
                    optionsMap.set(optionRef, optionRef);
                    const childProps = child.props;

                    return React.cloneElement(child, {
                        ref: optionRef,
                        map: optionsMap,
                        ...childProps,
                    });
                })}
            </ul>
        );
    }
);

interface OptionProps extends React.ComponentProps<"li"> {
    map?: any;
}

const Option = React.forwardRef<HTMLLIElement, OptionProps>(
    ({ map, ...props }, forwardRef) => {
        const optionId = useId();

        // console.log("Map values: ", map.get(forwardRef).current);

        return (
            <li
                id={`option-${optionId}`}
                role="option"
                aria-selected="false"
                onClick={() => console.log("map ", map.get(forwardRef).current)}
                ref={forwardRef}
                {...props}
            />
        );
    }
);
