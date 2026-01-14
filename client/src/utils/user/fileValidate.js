
export const validateFile = (file) => {

    const file_array = file.name.split(".");

    const format = file_array[file_array.length - 1];

    const regex=/jpeg|jpg|png|svg|webp/;

    const valid= regex.test(format);

    if(valid) {

        return true;

    }else {

        return false;
    }

}