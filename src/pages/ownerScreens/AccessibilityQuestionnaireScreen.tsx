import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomButton from '../../components/CustomButton';
import MultilineInput from '../../components/MultilineTextInput';
import {
  getAnswers,
  getQuestions,
  saveAnswers,
} from '../../store/establishment/establishmentActions';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Colors } from '../../utlis/Colors';
import { Fonts } from '../../utlis/GlobalFonts';
import GlobalIcon from '../../utlis/GlobalIcon';
import { ResponsiveSizes } from '../../utlis/ResponsiveSizes';
import { SizeMattersConfig } from '../../utlis/SizeMattersConfig';

const {moderateScale, verticalScale} = SizeMattersConfig;
const {hp} = ResponsiveSizes;

const AccessibilityQuestionnaire = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const questionss = useAppSelector(
    state => state.establishmentSlice.questions,
  );
  const [questions, setQuestions] = useState<any>(questionss);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 4;
  const totalPages = Math.ceil(questionss?.length / questionsPerPage);
  const [errors, setErrors] = useState<{[key: number]: string}>({});
  const [answers, setAnswers] = useState<any[]>([]);
  const isLoading = useAppSelector(state => state.commonSlice.isLoading);
  const isScreenLoading = useAppSelector(
    state => state.commonSlice.isScreenLoading,
  );
  const token = useAppSelector(state => state.userSlice.token);

  useEffect(() => {
    if (token) {
      dispatch(getAnswers());
    } else {
      dispatch(getQuestions());
    }
  }, []);

  useEffect(() => {
    setQuestions(questionss);
  }, [questionss]);

  useEffect(() => {
    setErrors({});
  }, [currentPage]);

  const handleRadioSelect = (questionId: number, optionId: number) => {
    setQuestions((prevQuestions: any) =>
      prevQuestions.map((question: any) =>
        question?.id === questionId
          ? {
              ...question,
              is_answered: true,
              options: question?.options?.map((option: any) => ({
                ...option,
                is_selected: option?.id === optionId,
              })),
            }
          : question,
      ),
    );

    setAnswers((prevAnswers: any[]) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        ans => ans?.question_id === questionId,
      );

      const updatedAnswer = {
        question_id: questionId,
        answer_type: 'option',
        options: [optionId],
      };

      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = updatedAnswer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, updatedAnswer];
      }
    });
  };

  const handleTextInput = (questionId: number, text: string) => {
    setQuestions((prevQuestions: any) =>
      prevQuestions?.map((question: any) =>
        question.id === questionId
          ? {...question, is_answered: !!text, answer: text}
          : question,
      ),
    );

    setAnswers((prevAnswers: any[]) => {
      const existingAnswerIndex = prevAnswers.findIndex(
        ans => ans?.question_id === questionId,
      );
      const updatedAnswer = {
        question_id: questionId,
        answer_type: 'text',
        options: text,
      };
      if (existingAnswerIndex > -1) {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[existingAnswerIndex] = updatedAnswer;
        return updatedAnswers;
      } else {
        return [...prevAnswers, updatedAnswer];
      }
    });
  };

  const handleSubmit = async () => {
    const newErrors: {[key: number]: string} = {};
    const currentQuestions = questions.slice(
      (currentPage - 1) * questionsPerPage,
      currentPage * questionsPerPage,
    );

    currentQuestions.forEach((question: any) => {
      if (!question?.is_answered) {
        newErrors[question.id] = 'This is required.';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      if (answers?.length > 0) {
        const res = await dispatch(saveAnswers(answers)).unwrap();
        if (res.success == true) {
          if (token) {
            navigation.goBack();
          } else {
            navigation.navigate('verifycodeScreen');
          }
        }
      } else {
        navigation.goBack();
      }
    }
  };

  const handleSkip = async () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      if (answers?.length > 0) {
        const res = await dispatch(saveAnswers(answers)).unwrap();
        if (res.success == true) {
          if (token) {
            navigation.goBack();
          } else {
            navigation.navigate('verifycodeScreen');
          }
        }
      } else {
        navigation.goBack();
      }
    }
  };

  const handleBackPress = () => {
    if (currentPage === 1) {
      navigation.goBack();
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  );

  return (
    <>
      {isScreenLoading ? (
        <View style={styles.mainContainer}>
          <ActivityIndicator color={Colors.redColor} size={'large'} />
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollViewContent}
            enableOnAndroid={true}
            bounces={false}
            showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Pressable onPress={handleBackPress}>
                <GlobalIcon
                  library="Ionicons"
                  name="arrow-back"
                  size={24}
                  color={Colors.blackColor}
                />
              </Pressable>
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {width: `${(currentPage / totalPages) * 100}%`},
                  ]}
                />
              </View>
              <Text style={styles.pageIndicator}>
                {currentPage}/{totalPages}
              </Text>
            </View>
            {currentPage === 1 && (
              <View>
                <Text style={styles.title}>Accessibility Questionnaire</Text>
                <Text style={styles.subtitle}>
                  Please fill out our accessibility questionnaire to give us a
                  better idea of what accessibility facilities you provide
                </Text>
              </View>
            )}
            <ScrollView
              contentContainerStyle={{
                ...styles.scrollContent,
                paddingVertical:
                  currentPage === 1 ? verticalScale(0) : verticalScale(30),
              }}
              bounces={false}
              showsVerticalScrollIndicator={false}>
              {currentQuestions.map((question: any) => (
                <View key={question?.id} style={styles.questionContainer}>
                  <Text style={styles.questionText}>{question?.question}</Text>
                  {question?.answer_type === 'option' && question?.options ? (
                    question?.options.map((option: any) => (
                      <Pressable
                        key={option.id}
                        style={styles.radioOption}
                        onPress={() =>
                          handleRadioSelect(question?.id, option?.id)
                        }>
                        <View style={styles.radioButton}>
                          {option?.is_selected && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <Text style={styles.radioText}>
                          {option?.option_key}
                        </Text>
                      </Pressable>
                    ))
                  ) : (
                    <MultilineInput
                      onChangeText={text => handleTextInput(question?.id, text)}
                      inputStyle={{backgroundColor: Colors.whiteColor}}
                      value={question?.answer || ''}
                      autoCorrect={false}
                      autoCapitalize="none"
                      textContentType="none"
                    />
                  )}
                  {errors[question?.id] && (
                    <Text style={styles.errorText}>{errors[question?.id]}</Text>
                  )}
                </View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <CustomButton
                title="Save & Continue"
                onPress={handleSubmit}
                buttonStyle={styles.submitButton}
                textStyle={styles.submitButtonText}
                isLoading={isLoading}
                disabled={isLoading}
              />
              <Pressable disabled={isLoading} onPress={handleSkip}>
                <Text style={styles.skipText}>skip</Text>
              </Pressable>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.allScreensBgColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(10),
  },
  progressContainer: {
    flex: 1,
    height: verticalScale(4),
    backgroundColor: Colors.lightGreyColor,
    marginHorizontal: moderateScale(10),
    borderRadius: moderateScale(2),
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.redColor,
    borderRadius: moderateScale(2),
  },
  pageIndicator: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
  },
  title: {
    fontSize: moderateScale(24),
    fontFamily: Fonts.InterBold,
    color: Colors.blackColor,
    marginTop: verticalScale(20),
    marginHorizontal: moderateScale(20),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: Colors.greyColor,
    marginTop: verticalScale(10),
    marginHorizontal: moderateScale(20),
    marginBottom: verticalScale(20),
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
  },
  questionContainer: {
    marginBottom: verticalScale(20),
  },
  questionText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    marginBottom: verticalScale(10),
  },
  descriptionText: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.InterMedium,
    color: Colors.blackColor,
    marginBottom: verticalScale(10),
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  radioButton: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    borderWidth: 2,
    borderColor: Colors.greyColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(10),
  },
  radioButtonInner: {
    width: moderateScale(10),
    height: moderateScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: Colors.redColor,
  },
  radioText: {
    fontSize: moderateScale(14),
    color: Colors.blackColor,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: Colors.lightGreyColor,
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(16),
    backgroundColor: Colors.whiteColor,
    height: verticalScale(170),
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    marginHorizontal: moderateScale(5),
    backgroundColor: Colors.whiteColor,
    paddingBottom: hp(12),
  },
  footer: {
    paddingHorizontal: moderateScale(20),
    paddingBottom: verticalScale(20),
  },
  submitButton: {
    backgroundColor: Colors.blackColor,
    borderRadius: moderateScale(30),
    height: verticalScale(40),
  },
  submitButtonText: {
    color: Colors.whiteColor,
    fontSize: moderateScale(16),
    fontFamily: Fonts.InterMedium,
  },
  skipText: {
    fontSize: moderateScale(14),
    color: Colors.redColor,
    textAlign: 'center',
    marginTop: verticalScale(7),
  },
  errorText: {
    color: Colors.redColor,
    fontSize: moderateScale(12),
    marginTop: verticalScale(5),
    fontFamily: Fonts.InterRegular,
  },
  mainContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default AccessibilityQuestionnaire;
