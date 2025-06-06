import * as Font from 'expo-font';
import { useEffect, useState } from "react";

export default function GlobalStyle() {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    
        const loadFonts = async () => {
            await Font.loadAsync({
                'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
                'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
                'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
            });
            setFontsLoaded(true);
        }
    
        useEffect(() => {
            loadFonts();
        }, []);
}