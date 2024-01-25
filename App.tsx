// @ts-nocheck
import React, { useRef, useState } from 'react';
import {
  ColorSchemeName,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const data = new Array(100).fill(0).map((_, index) => ({
  title: `Item ${index}`,
}));

const colors = {
  background: {
    dark: 'rgb(10, 12, 14)',
    light: 'rgb(235, 237, 239)',
  },
  text: {
    dark: 'rgb(235, 237, 239)',
    light: 'rgb(10, 12, 14)',
  },
  border: {
    dark: 'rgb(0, 0, 255)',
    light: 'rgb(0, 0, 200)',
  },
  focusedBorder: {
    dark: 'rgb(255, 0, 0)',
    light: 'rgb(200, 0, 0)',
  },
};

const schemeStyles = (scheme: ColorSchemeName) => ({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    gap: 20,
    padding: 20,
    backgroundColor: colors.background[scheme],
  },
  column: {
    flex: 1,
  },
  columnHeader: {
    height: 60,
  },
  columnHeaderText: {
    color: colors.text[scheme],
  },
  item: {
    height: 100,
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemUnfocused: {
    borderColor: colors.border[scheme],
  },
  itemFocused: {
    borderColor: colors.focusedBorder[scheme],
  },
  scrollContentContainerStyle: {
    gap: 20,
  },
});

const App = () => {
  const scheme = useColorScheme();

  const styles = schemeStyles(scheme);

  const renderItem = ({ item, index }) => {
    return <RowItem key={index} index={index} {...item} rowStyles={styles} />;
  };

  const keyExtractor = (item) => item.title;

  const scrollRef = useRef(null);
  const manualScroll = (index) => {
    scrollRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const renderItemManualScroll = ({ item, index }) => {
    return (
      <RowItem
        key={index}
        {...item}
        index={index}
        onFocus={manualScroll}
        rowStyles={styles}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={[styles.columnHeader, styles.columnHeaderText]}>
          ScrollView. This one acts as expected, but renders all items all at
          once
        </Text>
        <ScrollView contentContainerStyle={styles.scrollContentContainerStyle}>
          {data.map((item, index) => renderItem({ item, index }))}
        </ScrollView>
      </View>
      <View style={styles.column}>
        <Text style={[styles.columnHeader, styles.columnHeaderText]}>
          FlatList. At the edge of the Flatlist it will scroll the Flatlist, but
          not select the next item.
        </Text>
        <FlatList
          contentContainerStyle={styles.scrollContentContainerStyle}
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.columnHeader, styles.columnHeaderText]}>
          FlatList, manual scroll. Works as expected but if you press up/down
          too fast it will focus outside of the flatlist eventually.
        </Text>
        <FlatList
          ref={scrollRef}
          contentContainerStyle={styles.scrollContentContainerStyle}
          data={data}
          renderItem={renderItemManualScroll}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

const RowItem = ({ index, title, onFocus, rowStyles }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => {
    console.log('handleFocus', index);
    setFocused(true);

    onFocus?.(index);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <View
        style={[
          rowStyles.item,
          focused ? rowStyles.itemFocused : rowStyles.itemUnfocused,
        ]}
      >
        <Text style={rowStyles.columnHeaderText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default App;
