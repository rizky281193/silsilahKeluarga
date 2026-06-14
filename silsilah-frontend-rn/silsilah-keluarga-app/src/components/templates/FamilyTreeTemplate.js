import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TreeItem from '../molecules/TreeItem';
import { spacing } from '../../theme/tokens';

export default function FamilyTreeTemplate({ treeData }) {
  return (
    <FlatList
      data={treeData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TreeItem node={item} level={0} />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl * 2, // Memberikan ruang ekstra di bagian bawah agar tidak terpotong dock iOS
  },
});