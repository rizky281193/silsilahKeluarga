import React, { useEffect, useState } from 'react';
import DefaultPageTemplate from '../components/templates/DefaultPageTemplate';
import FamilyTreeTemplate from '../components/templates/FamilyTreeTemplate';
import LoadingState from '../components/atoms/LoadingState';
import { getMembers } from '../services/memberService.js';
import { buildNestedTree } from '../utils/treeTransformer'; // <-- Panggil fungsi baru

export default function MembersPage() {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorMessage(null);
        
        const flatData = await getMembers();
        
        // Transformasi data menjadi nested structure untuk Collapsible List
        const structuredTree = buildNestedTree(flatData);
        setTreeData(structuredTree);
      } catch (error) {
        setErrorMessage(error.message || 'Gagal memuat silsilah keluarga.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <LoadingState label="Menyusun silsilah keluarga..." />;
  }

  return (
    <DefaultPageTemplate title="Bagan Silsilah Keluarga" errorMessage={errorMessage}>
      <FamilyTreeTemplate treeData={treeData} />
    </DefaultPageTemplate>
  );
}