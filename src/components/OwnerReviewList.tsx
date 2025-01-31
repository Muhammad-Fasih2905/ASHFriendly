import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ReviewApi } from "../interfaces/Interfaces";
import { Colors } from "../utlis/Colors";
import { Fonts } from "../utlis/GlobalFonts";
import GlobalIcon from "../utlis/GlobalIcon";
import { SizeMattersConfig } from "../utlis/SizeMattersConfig";
import ImageCarousel from "./ImageCarousel";

const { moderateScale, verticalScale } = SizeMattersConfig;
export const renderReview = ({ item }: { item: ReviewApi }) => {
    return (
        <View style={styles.reviewItem}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.avatar} >
                    <Image source={{ uri: item?.user?.profile_image }} style={styles?.avatar} />
                </View>
                <View style={{ flexDirection: "row", width: '100%' }}>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.reviewName}>{item?.user?.name}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", width: '100%' }}>
                            <View style={styles.ratingContent}>
                                {[...Array(5)].map((_, index) => {
                                    const isFullStar = item.rating >= index + 1;
                                    const isHalfStar = item.rating > index && item.rating < index + 1;
                                    const isEmptyStar = item.rating < index + 1;

                                    return (
                                        <GlobalIcon
                                            key={index}
                                            library="FontAwesome"
                                            name={isHalfStar ? "star-half" : "star"}
                                            size={14}
                                            color={isFullStar ? Colors.yellowColor : (isHalfStar ? Colors.yellowColor : Colors.lightGreyColor)}
                                        />
                                    );
                                })}
                                <Text style={styles.ratingText}>{item.rating}</Text>
                            </View>
                            <Text style={styles.dateText}>{item?.created_at}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.reviewContent}>
                <Text style={styles.commentText}>{item.comment}</Text>
                {
                    item?.images?.length > 0 ?
                        <View style={styles.imageView}>
                            <ImageCarousel images={item?.images} />
                        </View> : null
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ratingContainer: {
        marginBottom: verticalScale(4),
        marginLeft: 10
    },
    ratingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    ratingText: {
        marginLeft: moderateScale(4),
        fontSize: moderateScale(14),
        color: Colors.blackColor,
        fontFamily: Fonts.InterMedium
    },
    reviewCount: {
        fontSize: moderateScale(12),
    },
    ratingBars: {
        marginBottom: verticalScale(16),
    },
    ratingBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    reviewItem: {
        marginBottom: verticalScale(16),
    },
    avatar: {
        width: moderateScale(40),
        height: moderateScale(40),
        borderRadius: 25
    },
    reviewContent: {
        flex: 1,
    },
    reviewName: {
        fontSize: moderateScale(16),
        marginBottom: verticalScale(4),
        color: Colors.blackColor,
        fontFamily: Fonts.InterMedium
    },
    dateText: {
        fontSize: moderateScale(12),
        left: verticalScale(-40),
        color: Colors.greenAndGreyMixColor,
        fontFamily: Fonts.InterRegular
    },
    commentText: {
        fontSize: moderateScale(14),
        marginTop: verticalScale(4),
        color: Colors.greenAndGreyMixColor,
        fontFamily: Fonts.InterRegular
    },
    imageView: {
        flex: 1,
        marginVertical: verticalScale(10),
        borderWidth: 1,
    }
});