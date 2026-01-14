import { useEffect, useState } from "react"

const useDebounce= (value)=>{

    const [debounce,setDebounce] = useState('');

    useEffect(()=>{
        const timer= setTimeout(()=>{
            setDebounce(value);
        },800);

        return ()=>clearTimeout(timer);
    },[value]);

    return debounce;
}

export default useDebounce;