import { useNavigate } from "react-router-dom";
import { EFuldmagtItem } from "../../../components/ui/EfuldmentItem/EfuldmentItem";
import { IoArrowBack } from "react-icons/io5";
import DropdownMenu from "../../../components/ui/dropdowns/DropDownMenu";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFuldmagtsList } from "../../../services/fuldmagt.services";
import { setFuldmagts } from "../../../redux/features/fuldmagts/fuldmagtsSlice";
import Loader from "../../../components/global/Loaders/Loader";

const options = [
  { key: "all", label: "All" },
  { key: "myfuldmagts", label: "My Fuldmagts" },
  { key: "assignedFuldmagts", label: "Assigned Fuldmagts" },
];

const AllFuldmagts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { fuldmagts } = useSelector((state) => state.fuldmagts);
  const { user } = useSelector((state) => state.user);
  const { company } = useSelector((state) => state.company);

  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchFuldmagts = async () => {
      try {
        setLoading(true);
        const response = await getFuldmagtsList(token);
        dispatch(setFuldmagts(response?.data?.data?.fuldmagts || []));
      } catch (error) {
        console.error("Error fetching fuldmagts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (fuldmagts.length === 0) {
      fetchFuldmagts();
    } else {
      setLoading(false);
    }
  }, [dispatch, fuldmagts.length, token]);

  // Classify Fuldmagts
  const filteredFuldmagts = useMemo(() => {
    if (!user && !company) return [];

    const myFuldmagts = fuldmagts.filter(
      (item) =>
        item.fuldmagtGiverId === user?._id ||
        item.fuldmagtGiverId === company?._id
    );

    const assignedFuldmagts = fuldmagts.filter(
      (item) => item.agentId === user?._id || item.agentId === company?._id
    );

    switch (selectedOption.key) {
      case "myfuldmagts":
        return myFuldmagts;
      case "assignedFuldmagts":
        return assignedFuldmagts;
      default:
        return fuldmagts;
    }
  }, [fuldmagts, selectedOption, user, company]);

  if (loading) return <Loader />;

  return (
    <div className="h-full w-full justify-center">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="font-semibold text-2xl py-2 px-4 hover:bg-gray-200 rounded-md"
          >
            <IoArrowBack />
          </button>
          <h2 className="font-semibold">Efuldmagts</h2>
        </div>

        <DropdownMenu
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          options={options}
        />
      </div>
      
      <div className="w-full mt-5">
        {filteredFuldmagts.map((item) => (
          <EFuldmagtItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AllFuldmagts;
