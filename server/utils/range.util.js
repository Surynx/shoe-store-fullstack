
const findDateRange = (range) => {

    let now = new Date();

    let start,end;
    
    switch(range) {

        case "today":
            start = new Date(now.setHours(0,0,0,0));
            end = new Date();
            break;

        case "thisWeek":
            let s = new Date()
            s.setDate( s.getDate() - s.getDay() )
            s.setHours(0,0,0,0)

            start = s;
            end = new Date();
            break;

        case "thisMonth":
            start = new Date(now.getFullYear(),now.getMonth(), 1);
            end = new Date();
            break;
        
        case "thisYear":
            start = new Date(now.getFullYear(),0,1);
            end = new Date();
            break;
        
        default:
            return null;
    }

    return { start,end };
}

export {findDateRange}