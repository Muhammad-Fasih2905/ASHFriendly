import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { ImageCarouselProps } from '../interfaces/interfaces';
import { Colors } from '../utlis/Colors';

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images = [] }: { images: Array<{ url: string } | string> }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const windowWidth = Dimensions.get('window').width;
    const normalizedImages = images.map((image) =>
        typeof image === 'string' ? image : image.url
    );
    const renderPagination = () => {
        return (
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            activeIndex === index && styles.paginationDotActive,
                        ]}
                    />
                ))}
            </View>
        );
    };

    const [isLoading, setIsLoading] = useState(false);
    const renderItem = ({ item }: { item: string }) => {
        return (
            <View style={[styles.imageContainer, { width: windowWidth }]}>
                {isLoading && (
                    <View style={[styles.image, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator
                            size="large"
                            color={Colors.redColor}
                        />
                    </View>
                )}
                <Image
                    source={{ uri: item }}
                    style={styles.image}
                    resizeMode="cover"
                    onLoadStart={() => setIsLoading(true)}
                    onLoadEnd={() => setIsLoading(false)}
                />
            </View>
        )
    }

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset;
        const index = Math.round(contentOffset.x / windowWidth);
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={normalizedImages}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyExtractor={(_, index) => index.toString()}
            />
            {normalizedImages?.length > 1 ? renderPagination() : null}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: 290,
    },
    imageContainer: {
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: Colors.whiteColor,
    },
});

export default ImageCarousel;